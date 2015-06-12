/// <reference path="./../Core/base.ts"/>

var args = process.argv.slice(2);
var options =
{
	x: 0,
	y: 4,
	z: 0,
	script: "./example.js",
	ip: "127.0.0.1",
	port: 25575,
	password: "password",
	clearArea: true
};

for (var i = 0; i < args.length; i++)
{
	for (var key in options)
	{
		var _key = key.length > 1 ? "--" : "-";
		_key += key;
		if (_key == args[i])
		{
			i++;
			if (typeof options[key] == 'number')
				options[key] = parseInt(args[i]);
			else
				options[key] = args[i].toString();
		}
	}
}

var rcon = require("rcon");
var commands = [];
var connection = new rcon(options.ip, options.port, options.password, { tcp: true, challenge: false });

var minPos = { x: options.x, y: options.y, z: options.z };
var maxPos = { x: options.x, y: options.y, z: options.z };

function NodeApi()
{
	function checkClearArea(x, y, z)
	{
		minPos.x = x < minPos.x ? x : minPos.x;
		minPos.y = y < minPos.y ? y : minPos.y;
		minPos.z = z < minPos.z ? z : minPos.z;

		maxPos.x = x > maxPos.x ? x : maxPos.x;
		maxPos.y = y > maxPos.y ? y : maxPos.y;
		maxPos.z = z > maxPos.z ? z : maxPos.z;
	}

	this.log = function(message)
	{
		console.log(message);
	}

	this.disco = function(wait, count)
	{
		for (var i = 0; i < count; i++)
		{
			process.stdout.write('\x07');
			console.log("Wait for " + wait + "ms? Pfff were in node here");
		}
	}

	this.placeBlock = function(id, data, x, y, z)
	{
		console.log("placeBlock not implemented");
	}

	this.placeCommandBlock = function(command, x, y, z)
	{
		checkClearArea(x, y, z);

		command = command.replace(/\\/g, "\\");
		command = command.replace(/\"/g, "\\\"");
		commands.push("setblock " + x + " " + y + " " + z + " minecraft:command_block 0 replace {Command:\"" + command + "\"}");
	}

	this.placeSign = function(text, direction, x, y, z)
	{
		checkClearArea(x, y, z);

		var data = { Text1: text[0], Text2: text[1], Text3: text[2], Text4: text[3], };
		commands.push("setblock " + x + " " + y + " " + z + " minecraft:standing_sign " + direction + " replace " + JSON.stringify(data));
	}

	this.save = function()
	{
		connection.on("auth", function ()
		{
			if (options.clearArea)
			{
				connection.send("fill " + minPos.x + " " + minPos.y + " " + minPos.z + " " + maxPos.x + " " + maxPos.y + " " + maxPos.z + " air 0 replace");
			}

			for (var i = 0; i < commands.length; i++)
			{
				(function (i)
				{
					setTimeout(function () { connection.send(commands[i]); }, i * 100);
				})(i);
			}
		});
		connection.connect();
	}
}

var vm = require("vm");
var fs = require("fs");

var context = { "api": new NodeApi() };
context = vm.createContext(context);

connection.on("error", function (err) { throw err; });

fs.readFile("./core.js", function (err, data)
{
	if (err)
		throw err;

	vm.runInContext(data, context);
	vm.runInContext("var startPosition = new Util.Vector3(" + options.x + ", " + options.y + ", " + options.z + ");", context);

	fs.readFile(options.script, function (err, scriptData)
	{
		if (err)
			throw err;

		vm.runInContext(scriptData, context);

		vm.runInContext("cbjsWorker();", context);
	});
});
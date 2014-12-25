//region core classes
var OutputHandler = new function()
{
	this.output = [];
	this.functions = [];
	this.current = 0;

	this.output[0] = '';
	this.functions[0] = function() { };

	this.addFunction = function(func)
	{
		if (this.functions.indexOf(func) == -1)
		{
			this.functions.push(func);
			var id = this.functions.indexOf(func);
			this.output[id] = '';

			var last = this.current;
			this.current = id;

			wire(2);
			command("setblock ~-3 ~ ~ minecraft:air 0 replace");
			func();

			this.current = last;
			return id;
		}
		return this.functions.indexOf(func);
	}
	this.removeFunction = function(func)
	{
		var id = this.functions.indexOf(func);
		if (id == -1)
			return;
		if (id == this.current)
			throw "Cant remove current Function!";

		this.functions.splice(id, 1);
		this.output.splice(id, 1);
	}
	this.addToCurrent = function(code)
	{
		this.output[this.current] += code;
	}
}
//endregion

//region core functions
var direction = 1;

function block(id, data)
{
	id = id || 1;
	data = data || 0;
	OutputHandler.addToCurrent('b' + id + '_' + data + ';');
}
function command(text, placeRepeater)
{
	text = text || "say CommandBlocksJS error invalid call 'command();'";
	if (placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('c' + text + ';');
}
function queryCommand(text, placeRepeater)
{
	text = text || "say CommandBlocksJS error invalid call 'command();'";
	if (placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('q' + text + ';');
}
function sidewards(func)
{
	direction++;
	var code = 's';
	var oldManager = OutputHandler;
	var newManager = new function()
	{
		this.addToCurrent = function(data) { code += data.replace(/;/g, '|'); }
		this.addFunction = function(func)
		{
			direction--;
			OutputHandler = oldManager;
			var id = OutputHandler.addFunction(func);
			OutputHandler = newManager;
			direction++;
			return id;
		}
	}
	OutputHandler = newManager;
	func();
	OutputHandler = oldManager;
	OutputHandler.addToCurrent(code + ';');
	direction--;
}
function call(func, placeRepeater)
{
	var funcId = OutputHandler.addFunction(func);
	if (placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('e' + funcId + ';');
}
function sign(text1, text2, text3, text4, direc)
{
	text1 = text1 || "";
	text2 = text2 || "";
	text3 = text3 || "";
	text4 = text4 || "";
	direc = direc || direction * 4;
	text2 = text2 ? "_" + text2 : "";
	text3 = text3 ? "_" + text3 : "";
	text4 = text4 ? "_" + text4 : "";
	OutputHandler.addToCurrent('n' + text1 + text2 + text3 + text4 + '_' + direc + ';');
}
//enregion

//region wrapper functions
function wire(length)
{
	length = length || 1;
	for (var i = 0; i < length; i++)
		block(55);
}
function torch(activated)
{
	activated = activated || true;
	var data = (direction == 4) ? direction + 1 : 1;
	if (activated == false)
		block(75, data);
	else
		block(76, data);
}
function delay(time)
{
	time = time || 0;
	while (time >= 0)
	{
		var delay = (time > 3) ? 3 : (time == 0) ? 0 : time - 1;
		var data = delay * 4 + direction;
		block(93, data);
		time -= (time > 3) ? delay + 1 : delay + 2;
	}
}
function comparator(activated)
{
	activated = activated || false;
	if (activated == false)
		block(149, direction);
	else
		block(150, direction);
}
function invert(blockId, placeRepeater)
{
	blockId = blockId || 1;
	if (placeRepeater !== false)
		delay();
	block(blockId);
	torch();
}
//endregion

//region main code
block(143, 5);
wire(1);
function cbjsWorker(schematic)
{
	/*while(OutputHandler.current < OutputHandler.functions.length)
	{
		OutputHandler.functions[OutputHandler.current]();
		OutputHandler.current++;
		if(OutputHandler.current < OutputHandler.functions.length)
		{
			wire(2);
			command("setblock ~-3 ~ ~ minecraft:air 0 replace");
		}
	}*/
	OutputParser.start(schematic);
	api.log("Successfully executed " + OutputHandler.functions.length + " functions!");
}
//endregion

//region internal helper classes
var Naming = new function()
{
	this.names = {};

	this.next = function(name)
	{
		this.names[name] = this.names[name] || 0;
		this.names[name]++;
		return name + this.names[name];
	}
}
function Vector3(x, y, z)
{
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

	this.toString = function(splitter)
	{
		splitter = splitter || ' ';
		return this.x + splitter + this.y + splitter + this.z;
	}
	this.clone = function()
	{
		return new Vector3(this.x, this.y, this.z);
	}
}
//endredion
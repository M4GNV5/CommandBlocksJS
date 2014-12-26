declare var api: any;

//region core classes
class OutputHandler
{
	static instance: OutputHandler;

	constructor()
	{
	}

	output: string[] = [''];
	functions: Function[] = [function () { }];
	current: number = 0;

	addFunction(func: Function): number
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

	removeFunction(func: Function): void
	{
		var id = this.functions.indexOf(func);
		if (id == -1)
			return;
		if (id == this.current)
			throw "Cant remove current Function!";

		this.functions.splice(id, 1);
		this.output.splice(id, 1);
	}

	addToCurrent(code: string): void
	{
		this.output[this.current] += code;
	}
}

var outputHandler = new OutputHandler();
//endregion

//region core functions
var direction: number = 1;

function block(id: number = 1, data: number = 0): void
{
	outputHandler.addToCurrent('b' + id + '_' + data + ';');
}

function command(text: string, placeRepeater: boolean = true): void
{
	if (placeRepeater)
		delay();
	outputHandler.addToCurrent('c' + text + ';');
}

function queryCommand(text: string, placeRepeater: boolean = true): void
{
	if (placeRepeater)
		delay();
	outputHandler.addToCurrent('q' + text + ';');
}

function sidewards(func: Function): void
{
	direction++;
	var code = 's';
	var oldManager = outputHandler;
	var newManager = new function ()
	{
		this.addToCurrent = function (data) { code += data.replace(/;/g, '|'); }
		this.addFunction = function (func)
		{
			direction--;
			outputHandler = oldManager;
			var id = outputHandler.addFunction(func);
			outputHandler = newManager;
			direction++;
			return id;
		}
	}
	outputHandler = newManager;
	func();
	outputHandler = oldManager;
	outputHandler.addToCurrent(code + ';');
	direction--;
}

function call(func: Function, placeRepeater: boolean = true): void
{
	var funcId = outputHandler.addFunction(func);
	if (placeRepeater)
		delay();
	outputHandler.addToCurrent('e' + funcId + ';');
}

function sign(text1: string = "", text2: string = "", text3: string = "", text4: string = "", direc: number = direction * 4): void
{
	outputHandler.addToCurrent('n' + text1 + text2 + text3 + text4 + '_' + direc + ';');
}
//enregion

//region wrapper functions
function wire(length: number = 1): void
{
	for (var i = 0; i < length; i++)
		block(55);
}

function torch(activated: boolean = true): void
{
	var data = (direction == 4) ? direction + 1 : 1;
	if (activated)
		block(76, data);
	else
		block(75, data);
}

function delay(time = 0): void
{
	while (time >= 0)
	{
		var delay = (time > 3) ? 3 : (time == 0) ? 0 : time - 1;
		var data = delay * 4 + direction;
		block(93, data);
		time -= (time > 3) ? delay + 1 : delay + 2;
	}
}

function comparator(activated: boolean = false): void
{
	if (activated)
		block(150, direction);
	else
		block(149, direction);
}

function invert(blockId: number = 1, placeRepeater: boolean = true): void
{
	if (placeRepeater)
		delay();
	block(blockId);
	torch();
}
//endregion

//region main code
block(143, 5);
wire(1);

function cbjsWorker(): void
{
	OutputParser.start();
	api.log("Successfully executed " + outputHandler.functions.length + " functions!");
}
//endregion

//region internal helper classes
class Naming
{
	static names = {};

	static next(name: string): string
	{
		this.names[name] = this.names[name] || 0;
		this.names[name]++;
		return name + this.names[name];
	}
}

class Vector3
{
	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toString(separator: string = ' '): string
	{
		return this.x + separator + this.y + separator + this.z;
	}

	add(b: Vector3): Vector3
	{
		this.x += b.x;
		this.y += b.y;
		this.z += b.z;

		return this;
	}

	subtract(b: Vector3): Vector3
	{
		this.x -= b.x;
		this.y -= b.y;
		this.z -= b.z;

		return this;
	}

	clone(): Vector3
	{
		return new Vector3(this.x, this.y, this.z);
	}
}
//endredion
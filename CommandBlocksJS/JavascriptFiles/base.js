﻿//region classes and extension methods
var OutputHandler = new function()
{
	this.output = [];
	this.functions = [];
	this.current = 0;

	this.output[0] = '';
	this.functions[0] = userCode;

	this.addFunction = function(func)
	{
		if(this.functions.indexOf(func) == -1)
		{
			this.functions.push(func);
			this.output[this.functions.indexOf(func)] = '';
		}
		return this.functions.indexOf(func);
	}
	this.removeFunction = function(func)
	{
		var id = this.functions.indexOf(func);
		if(id == -1)
			return;
		if(id == this.current)
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
	OutputHandler.addToCurrent('b'+id+'_'+data+';');
}
function command(text, placeRepeater)
{
	text = text || "say CommandBlocksJS error invalid call 'command();'";
	if(placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('c'+text+';');
}
function queryCommand(text, placeRepeater)
{
	text = text || "say CommandBlocksJS error invalid call 'command();'";
	if(placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('q'+text+';');
}
function sidewards(func)
{
	direction++;
	var code = 's';
	var oldManager = OutputHandler;
	var newManager = new function()
	{
		this.addToCurrent = function(data) { code += data.replace(/;/g, '|'); }
		this.addFunction = function(func) { return oldManager.addFunction(func); }
	}
	OutputHandler = newManager;
	func();
	OutputHandler = oldManager;
	OutputHandler.addToCurrent(code+';');
	direction--;
}
function call(func, placeRepeater)
{
	var funcId = OutputHandler.addFunction(func);
	if(placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('e'+funcId+';');
}
//enregion

//region wrapper functions
function wire(length)
{
	length = length || 1;
	for(var i = 0; i < length; i++)
		block(55);
}
function torch(activated)
{
	activated = activated || true;
	var data = (direction == 4) ? direction+1 : 1;
	if(activated == false)
		block(75, data);
	else
		block(76, data);
}
function delay(time)
{
	time = time || 0;
	while(time >= 0)
	{
		var delay = (time > 3) ? 3 : (time == 0) ? 0 : time-1;
		var data = delay * 4 + direction;
		block(93, data);
		time -= (time > 3) ? delay+1 : delay+2;
	}
}
function comparator(activated)
{
	activated = activated || false;
	if(activated == false)
		block(149, direction);
	else
		block(150, direction);
}
function invert(blockId, placeRepeater)
{
	blockId = blockId || 1;
	if(placeRepeater !== false)
		delay();
	block(blockId);
	torch();
}
//endregion

//region usercode
function userCode()
{
	%code%
}
//endregion

//region main code
function main()
{
	wire(2);
	while(OutputHandler.current < OutputHandler.functions.length)
	{
		OutputHandler.functions[OutputHandler.current]();
		fs.writeFile(OutputHandler.current+'.txt', OutputHandler.output[OutputHandler.current]);
		OutputHandler.current++;
		wire(2);
		command("setblock ~-3 ~ ~ minecraft:air 0 replace");
	}
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
		return name+this.names[name];
	}
}
//endredion

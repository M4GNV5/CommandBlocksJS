//region classes and extension methods
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

//region utility functions
function wire(length)
{
	length = length || 1;
	for(var i = 0; i < length; i++)
		OutputHandler.addToCurrent('w;');
}
function torch()
{
	OutputHandler.addToCurrent('t;');
}
function delay(time)
{
	time = time || 0;
	while(time >= 0)
	{
		var delay = (time > 3) ? 3 : (time == 0) ? 0 : time-1;
		OutputHandler.addToCurrent('r'+delay+';');
		time -= (time > 3) ? delay+1 : delay+2;
	}
}
function comparator()
{
	OutputHandler.addToCurrent('o;');
}
function command(text, placeRepeater)
{
	text = text || "say CommandBlocksJS error invalid call 'command();'";
	if(placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('c'+text+';');
}
function block(id, data)
{
	id = id || 1;
	data = data || 0;
	OutputHandler.addToCurrent('b'+id+'_'+data+';');
}
function sidewards(func)
{
	var code = 's';
	var oldManager = OutputHandler;
	var newManager = new function()
	{
		this.addToCurrent = function(data) { code += data.replace(/;/g, ':'); }
		this.addFunction = function(func) { return oldManager.addFunction(func); }
	}
	OutputHandler = newManager;
	func();
	OutputHandler = oldManager;
	OutputHandler.addToCurrent(code+';');
}
function call(func, placeRepeater)
{
	var funcId = OutputHandler.addFunction(func);
	if(placeRepeater !== false)
		delay();
	OutputHandler.addToCurrent('e'+funcId+';');
}
//enregion

//region usercode
function userCode()
{
	%code%
}
//endregion

//region main code
function main()
{
	OutputHandler.addToCurrent('w;w;');
	while(OutputHandler.current < OutputHandler.functions.length)
	{
		OutputHandler.functions[OutputHandler.current]();
		fs.writeFile(OutputHandler.current+'.txt', OutputHandler.output[OutputHandler.current]);
		OutputHandler.current++;
		OutputHandler.addToCurrent('w;w;');
	}
}
//endregion

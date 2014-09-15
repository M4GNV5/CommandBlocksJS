//region classes and extension methods
var OutputHandler = new function()
{
	this.output = [];
	this.functions = [];
	this.current = 0;

	this.output[0] = '';
	this.functions[0] = main;

	this.addFunction = function(func)
	{
		if(!this.functions.indexOf(func) > -1)
		{
			this.functions.push(func);
			this.output[this.functions.indexOf(func)] = '';
		}
		return this.functions.indexOf(func);
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
	time = time || 1;
	for(var i = 0; i < time; i++)
		OutputHandler.addToCurrent('r;');
}
function comparator()
{
	OutputHandler.addToCurrent('o;');
}
function command(text)
{
	text = text || 'say CommandBlocks.js error invalid call "command();"';
	OutputHandler.addToCurrent('r;c'+text+';');
}
function validateSync(command)
{
	command = command || 'say CommandBlocks.js error invalid call "validateSync();"';
	OutputHandler.addToCurrent('r;c'+command+';c;');
}
function block(id, data)
{
	id = id || 1;
	data = data || 0;
	OutputHandler.addToCurrent('b'+id+'_'+data+';');
}
function testfor(statement, callback)
{
	validate('testfor '+statement, callback);
}
function testforblock(statement, callback)
{
	validate('testforblock '+statement, callback);
}
function validate(command, callback)
{
	var callbackID = OutputHandler.addFunction(callback);
	OutputHandler.addToCurrent('r;sc'+command+':o:e'+callbackID+';');
}
function call(func)
{
	var funcId = OutputHandler.addFunction(func);
	OutputHandler.addToCurrent('r;e'+funcId+';');
}
//enregion

//region usercode
function main()
{
	%code%
}
//endregion

//region main code
OutputHandler.addToCurrent('w;w;');
while(OutputHandler.current < OutputHandler.functions.length)
{
	OutputHandler.functions[OutputHandler.current]();
	fs.writeFile(OutputHandler.current+'.txt', OutputHandler.output[OutputHandler.current]);
	OutputHandler.current++;
	OutputHandler.addToCurrent('w;w;');
}
//endregion
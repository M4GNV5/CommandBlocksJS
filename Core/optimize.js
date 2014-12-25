var Optimizer = new function()
{
	var removedFunctions = 0;
	this.emptyFunctionReplace = "cgamerule [Optimizer] Removed empty function";
	this.emptyOnceFunctionReplace = "cgamerule [Optimizer] Removed empty callOnce function";

	this.start = function()
	{
		this.emptyFunctions();
		this.emptyCallOnce();
		this.singleCall();

		if(removedFunctions > 0)
			api.log("[Optimizer] removed "+removedFunctions+" functions!");
	}



	this.emptyFunctions = function()
	{
		for(var i = 0; i < OutputHandler.output.length; i++)
		{
			var current = OutputHandler.output[i];
			if(current != "" && current.split(';').length <= 5)
			{
				removeFunction(i, this.emptyFunctionReplace);
			}
		}
	}

	this.emptyCallOnce = function()
	{
		for(var i = 0; i < OutputHandler.output.length; i++)
		{
			var current = OutputHandler.output[i];
			if(current != "" && current.split(';').length <= 7)
			{
				if(current.split(';')[5] == "csetblock ~-3 ~ ~ minecraft:air 0 replace")
				{
					removeFunction(i, this.emptyOnceFunctionReplace);
				}
			}
		}
	}

	this.singleCall = function()
	{
		for(var i = 0; i < OutputHandler.output.length; i++)
		{
			var current = OutputHandler.output[i];
			if(current != "" && current.split(';').length <= 7)
			{
				removeFunction(i, current.split(';')[5]);
			}
		}
	}

	function removeFunction(id, replaceCalls)
	{
		replaceInAll("e"+id, replaceCalls);
		OutputHandler.output[id] = '';
		removedFunctions++;
	}

	function replaceInAll(before, after)
	{
		for(var i = 0; i < OutputHandler.output.length; i++)
		{
			var reg = new RegExp(before, 'g');
			if(OutputHandler.output[i].indexOf(before) !== -1)
			{
				OutputHandler.output[i] = OutputHandler.output[i].replace(reg, after);
			}
		}
	}
}

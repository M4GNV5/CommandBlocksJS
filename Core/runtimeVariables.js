function RuntimeInteger(options)
{
	if(typeof RuntimeInteger.score == 'undefined')
	{
		RuntimeInteger.score = new Score("std.values", "dummy");
	}

	options = options || {};

	this.name = options.name || Naming.next("int");

	options.startValue = options.startValue || 0;
	RuntimeInteger.score.set(this.name, options.startValue);


	this.set = function(value)
	{
		RuntimeInteger.score.set(this.name, value);
	}
	this.add = function(value)
	{
		RuntimeInteger.score.add(this.name, value);
	}
	this.remove = function(value)
	{
		RuntimeInteger.score.remove(this.name, value);
	}
	this.reset = function()
	{
		RuntimeInteger.score.reset(this.name);
	}

	this.test = function(callback, min, max)
	{
		RuntimeInteger.score.test(this.name, callback, min, max);
	}
	this.operation = function(operation, other, otherPlayer)
	{
		RuntimeInteger.score.operation(this.name, operation, otherPlayer, other);
	}

	this.hasValue = function(value, callback)
	{
		return this.isBetween(value, value, callback);
	}
	this.isBetween = function(min, max, callback)
	{
		var command ="scoreboard players test "+this.name+" "+RuntimeInteger.score.name+" "+min+" "+max;

		if(typeof callback !== 'undefined')
			validate(command, callback);

		return command;
	}

	this.asTellrawExtra = function()
	{
		var extra =
		{
			obj:
			{
				score:
				{
					name: "",
					objective: ""
				}
			}
		};
		extra.obj.score.name = this.name;
		extra.obj.score.objective = RuntimeInteger.score.name;

		return extra;
	}
}

function RuntimeBoolean()
{
	this.base = new RuntimeInteger();

	this.set = function(value)
	{
		if(value)
			this.base.set(1);
		else
			this.base.set(0);
	}
	this.hasValue = function(value, callback)
	{
		if(value)
			return this.base.hasValue(1, callback);
		else
			return this.base.hasValue(0, callback);
	}

	this.isTrue = function(callback)
	{
		return this.hasValue(true, callback);
	}
	this.isFalse = function(callback)
	{
		return this.hasValue(false, callback);
	}

	this.asTellrawExtra = function()
	{
		return this.base.asTellrawExtra();
	}
}

function RuntimeString(value)
{
	if(!RuntimeString.lastIndex || !RuntimeString.indexScore)
	{
		RuntimeString.lastIndex = 0;
		RuntimeString.indexScore = new Score("strings", "dummy");
	}

	RuntimeString.lastIndex++;
	this.selector = Selector.parse("@e[score_strings_min="+RuntimeString.lastIndex+",score_strings="+RuntimeString.lastIndex+"]");

	value = value || Naming.next("string");

	callOnce(function()
	{
		command('summon Chicken ~ ~1 ~ {CustomName:"'+value+'",NoAI:true}');

		RuntimeString.indexScore.set('@e[name='+value+']', RuntimeString.lastIndex);
	});
	delay(4);

	this.set = function(value)
	{
		command('entitydata '+this.selector+' {CustomName:"'+value+'"}');
	}
	this.hasValue = function(value, callback)
	{
		var hasValueSelector = this.selector.clone();
		hasValueSelector.setAttribute("name", value);

		if(typeof callback != 'undefined')
		{
			testfor(hasValueSelector, callback);
		}

		return hasValueSelector;
	}

	this.asTellrawExtra = function()
	{
		var extra =
		{
			obj:
			{
				selector: ""
			}
		};
		extra.obj.selector = this.selector.toString();

		return extra;
	}
}
RuntimeString.lastIndex = false;
RuntimeString.indexScore = false;

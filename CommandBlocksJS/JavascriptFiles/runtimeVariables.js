function RuntimeInteger(options)
{
	if(!RuntimeInteger.mobSpawned)
	{
		callOnce(function()
		{
			command('summon Chicken ~ ~1 ~ {CustomName:"'+RuntimeInteger.mobName+'",NoAI:true}');
		});
	}

	options = options || {};

	options.startValue = options.startValue || 0;
	options.name = options.name || Naming.next("int");

	var score = new Score(options.name, "dummy");
	score.set(RuntimeInteger.mob, options.startValue);

	this.name = options.name;

	this.set = function(value)
	{
		score.set(RuntimeInteger.mob, value);
	}
	this.add = function(value)
	{
		score.add(RuntimeInteger.mob, value);
	}
	this.remove = function(value)
	{
		score.remove(RuntimeInteger.mob, value);
	}
	this.reset = function()
	{
		score.reset(RuntimeInteger.mob);
	}

	this.test = function(callback, min, max)
	{
		score.test(RuntimeInteger.mob, callback, min, max);
	}
	this.operation = function(operation, other, otherPlayer)
	{
		otherPlayer = otherPlayer || RuntimeInteger.mob;
		score.operation(RuntimeInteger.mob, operation, otherPlayer, other);
	}

	this.hasValue = function(value, callback)
	{
		return this.isBetween(value, value, callback);
	}
	this.isBetween = function(min, max, callback)
	{
		var attributes = {};
		attributes[name] = "intmob";
		attributes["score_"+options.name+"_min"] = min.toString();
		if(max != false)
			attributes["score_"+options.name] = max.toString();
		var selector = new Selector("e", attributes);

		if(typeof callback != 'undefined')
		{
			testfor(selector, callback);
		}

		return selector;
	}

	this.asTellrawExtra = function()
	{
		//Minecraft Bug https://bugs.mojang.com/browse/MC-74002
		//workaround giving value to all player
		score.operation("@a", "=", RuntimeInteger.mob, options.name);
		var extra =
		{
			obj:
			{
				score:
				{
					name: "@r",
					objective: ""
				}
			}
		};
		extra.obj.score.objective = options.name;
		return extra;
	}
}
RuntimeInteger.mobSpawned = false;
RuntimeInteger.mobName = 'intmob'
RuntimeInteger.mob = '@e[name='+RuntimeInteger.mobName+']';

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
	delay(2);

	this.set = function(value)
	{
		command('entitydata '+this.selector+' {CustomName:"'+value+'"}');
	}
	this.hasValue = function(value, callback)
	{
		var hasValueSelector = this.selector;
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

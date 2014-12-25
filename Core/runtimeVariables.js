function RuntimeByte()
{
	if (!RuntimeByte.nextPosition)
	{
		RuntimeByte.nextPosition = startPosition.clone();
		RuntimeByte.nextPosition.x--;
	}

	this.position = RuntimeByte.nextPosition.clone();
	RuntimeByte.nextPosition.z++;

	this.set = function(value)
	{
		var tilename = TileName.byId(value);
		command('setblock ' + this.position + ' ' + tilename + ' 0');
	}
	this.setTo = function(otherByte)
	{
		var otherPos = otherByte.position;

		command('clone ' + otherPos + ' ' + otherPos + ' ' + this.position);
	}
	this.hasValue = function(value, callback)
	{
		var tilename = TileName.byId(value);
		var command = 'testforblock ' + this.position + ' ' + tilename;

		if (typeof callback != 'undefined')
		{
			validate(command, callback);
		}

		return command;
	}
}
RuntimeByte.nextPosition = false;

function RuntimeBoolean()
{
	this.base = new RuntimeByte();

	this.set = function(value)
	{
		if (value)
			this.base.set(7);
		else
			this.base.set(0);
	}
	this.hasValue = function(value, callback)
	{
		if (value)
			return this.base.hasValue(7, callback);
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

	this.switch = function(isTrue, isFalse)
	{
		var bool = this;
		delay();
		sidewards(function()
		{
			queryCommand(bool.hasValue(7), false);
			comparator();
			call(isTrue, false);
		});
		delay();
		sidewards(function()
		{
			command("setblock ~-1 ~ ~2 minecraft:unpowered_repeater 1", false);
			delay();
			delay();
			call(isFalse, false);
		});
	}
}

function RuntimeInteger(options)
{
	if (!RuntimeInteger.mobSpawned)
	{
		callOnce(function()
		{
			command('summon Chicken ~ ~1 ~ {CustomName:"' + RuntimeInteger.mobName + '",NoAI:true}');
		});
		delay(2);

		RuntimeInteger.mobSpawned = true;
	}

	options = options || {};

	options.name = options.name || Naming.next("int");

	var score = new Score(options.name, "dummy");

	if (typeof options.startValue != 'undefined' && options.startValue !== false)
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
		attributes["name"] = "intmob";
		attributes["score_" + options.name + "_min"] = min.toString();
		if (typeof max != 'undefined' && max !== false)
			attributes["score_" + options.name] = max.toString();
		var selector = new Selector("e", attributes);

		if (typeof callback != 'undefined')
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
RuntimeInteger.mob = '@e[name=' + RuntimeInteger.mobName + ']';

function RuntimeString(value)
{
	if (!RuntimeString.lastIndex || !RuntimeString.indexScore)
	{
		RuntimeString.lastIndex = 0;
		RuntimeString.indexScore = new Score("strings", "dummy");
	}

	RuntimeString.lastIndex++;
	this.selector = Selector.parse("@e[score_strings_min=" + RuntimeString.lastIndex + ",score_strings=" + RuntimeString.lastIndex + "]");

	value = value || Naming.next("string");

	callOnce(function()
	{
		command('summon Chicken ~ ~1 ~ {CustomName:"' + value + '",NoAI:true}');

		RuntimeString.indexScore.set('@e[name=' + value + ']', RuntimeString.lastIndex);
	});
	delay(4);

	this.set = function(value)
	{
		command('entitydata ' + this.selector + ' {CustomName:"' + value + '"}');
	}
	this.hasValue = function(value, callback)
	{
		var hasValueSelector = this.selector.clone();
		hasValueSelector.setAttribute("name", value);

		if (typeof callback != 'undefined')
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
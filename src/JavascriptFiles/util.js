function validate(cmd, callback)
{
	delay();
	sidewards(function()
		{
			command(cmd, false);
			comparator();
			call(callback, false);
		});
}
function validateSync(cmd)
{
	cmd = cmd || 'say CommandBlocksJS error invalid call "validateSync();"';
	command(cmd);
	comparator();
}
function testfor(statement, callback)
{
	validate('testfor '+statement, callback);
}
function testforblock(statement, callback)
{
	validate('testforblock '+statement, callback);
}
function testforScore(name, max, min, callback)
{
	testfor("@a[score_"+name+"="+max+",score_"+name+"_min="+min+"]", callback);
}

function timer(tick, callback, stacks)
{
	stacks = stacks || 0;
	var timerScore;
	if(stacks != 0)
	{
		var callbackID = OutputHandler.addFunction(callback);
		var scoreName = "timer"+callbackID+"Stack";

		timerScore = new Score(scoreName, "dummy");
		timerScore.set(Selector.allPlayer(), 0);
	}

	var timerFunc = function()
	{
		if(stacks == 0)
		{
			callback();
		}
		else
		{
			timerScore.add(Selector.allPlayer(), 1);
			testfor(timerScore.getSelector(stacks), callback);
			timerScore.set(timerScore.getSelector(stacks), 0);
		}
		delay(tick);
		call(timerFunc);
	};
    call(timerFunc);
}

var Selector = new function()
{
	this.player = function(attributes)
	{
		return this.getSelector('p', attributes);
	}
	this.randomPlayer = function(attributes)
	{
		return this.getSelector('r', attributes);
	}
	this.allPlayer = function(attributes)
	{
		return this.getSelector('a', attributes);
	}
	this.entities = function(attributes)
	{
		return this.getSelector('e', attributes);
	}

	this.getSelector = function(selectorChar, attributes)
	{
		attributes = attributes || {};
		var sel = "@"+selectorChar;

		if(Object.keys(attributes).length < 1)
			return sel;

		sel += "[";
		for(var key in attributes)
		{
			sel += key+"="+attributes[key]+",";
		}
		sel = sel.substring(0, sel.length-1);
		sel += "]";

		return sel;
	}
}

function PlayerArray(name, selector)
{
	if(typeof name == 'undefined')
		throw 'Error cant create PlayerArray without name';
	this.name = name;

	command("scoreboard objectives add "+name+" dummy");
	if(typeof selector != 'undefined')
		command("scoreboard players set "+selector+" "+this.name+" 1");

	this.getSelector = function(name)
	{
		return "@a[score_"+this.name+"_min=1]";
	}
	this.addPlayer = function(selector)
	{
		command("scoreboard players set "+selector+" "+this.name+" 1");
	}
	this.removePlayer = function(selector)
	{
		selector = selector || this.getSelector();
		command("scoreboard players set "+selector+" "+this.name+" 0");
	}

	this.getScore = function()
	{
		return new Score(this.name);
	}
	this.getTeam = function(teamname)
	{
		return new Team(this.name, true);
	}
}

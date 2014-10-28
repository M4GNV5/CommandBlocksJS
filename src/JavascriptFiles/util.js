//region util.js
function validate(cmd, callback)
{
	delay();
	sidewards(function()
		{
			queryCommand(cmd, false);
			comparator();
			call(callback, false);
		});
}
function validateSync(cmd)
{
	cmd = cmd || 'say CommandBlocksJS error invalid call "validateSync();"';
	queryCommand(cmd);
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

function Player(selector)
{
	selector = selector || "@a";
	this.selector = selector;

	this.setGameMode = function(mode)
	{
		command("gamemode "+mode+" "+this.selector);
	}
	this.tell = function(text)
	{
		command("tell "+this.selector+" "+text);
	}
	this.tellraw = function(param)
	{
		if(typeof param == 'object')
		{
			param.tell(this.selector);
		}
		else
		{
			tellraw(this.selector, param);
		}
	}

	this.setTeam = function(team)
	{
		if(typeof team == 'object')
		{
			team.join(this.selector);
		}
		else
		{
			command("scoreboard teams join "+team+" "+this.selector);
		}
	}
	this.setScore = function(score, value)
	{
		if(typeof score == 'object')
		{
			score.set(this.selector, value);
		}
		else
		{
			command("scoreboard players set "+this.selector+" "+team+" "+value);
		}
	}
	this.addScore = function(score, value)
	{
		if(typeof score == 'object')
		{
			score.add(this.selector, value);
		}
		else
		{
			command("scoreboard players add "+this.selector+" "+team+" "+value);
		}
	}
	this.removeScore = function(score, value)
	{
		if(typeof score == 'object')
		{
			score.remove(this.selector, value);
		}
		else
		{
			command("scoreboard players remove "+this.selector+" "+team+" "+value);
		}
	}
}

function PlayerArray(name, selector, createObjective)
{
	name = name || Naming.next('array');
	this.name = name;

	var arrayScore;
	if(createObjective !== false)
		arrayScore = new Score(name, "dummy");
	else
		arrayScore = new Score(name);

	if(typeof selector != 'undefined')
		arrayScore.set(selector, 1);

	Player.call(this, arrayScore.getSelector(1));

	this.getSelector = function()
	{
		return this.selector;
	}
	this.addPlayer = function(selector)
	{
		arrayScore.set(selector, 1);
	}
	this.removePlayer = function(selector)
	{
		selector = selector || this.getSelector();
		arrayScore.set(selector, 0);
	}

	this.getScore = function()
	{
		return arrayScore;
	}
	this.toTeam = function(teamname)
	{
		teamname = teamname || this.name;
		var team = new Team(teamname, true);
		team.addPlayer(this.selector);
		return team;
	}
}
PlayerArray.prototype = Object.create(Player.prototype);
//endregion

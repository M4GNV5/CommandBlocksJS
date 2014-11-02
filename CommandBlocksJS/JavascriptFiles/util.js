//region util.js
function callOnce(callback, placeRepeater)
{
	call(function()
	{
		command("setblock ~-1 ~ ~ minecraft:air 0 replace", true);
		callback();
	}, placeRepeater);
}
function validate(cmd, callback, placeRepeater)
{
	if(placeRepeater !== false)
		delay();

	sidewards(function()
		{
			queryCommand(cmd, false);
			comparator();
			call(callback, false);
		});
}
function validateSync(cmd, placeRepeater)
{
	cmd = cmd || 'say CommandBlocksJS error invalid call "validateSync();"';
	queryCommand(cmd, placeRepeater);
	comparator();
}
function testfor(statement, callback, placeRepeater)
{
	validate('testfor '+statement, callback, placeRepeater);
}
function testfornot(statement, callback, placeRepeater)
{
	if(placeRepeater !== false)
		delay();

	sidewards(function()
	{
		queryCommand("testfor "+statement, false);
		comparator();
		block(1);
	});
	delay();
	sidewards(function()
	{
		command("setblock ~-1 ~ ~2 minecraft:unpowered_repeater 1", false);
		delay();
		delay();
		call(callback, false);
	});
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
	selector = selector || Selector.allPlayer();
	this.selector = selector;

	this.setGameMode = function(mode)
	{
		command("gamemode "+mode+" "+this.selector);
	}
	this.teleport = function(dest)
	{
		if(typeof dest == 'string')
		{
			command("tp "+this.selector+" "+dest);
		}
		else
		{
			if(typeof dest.yrot == 'undefined' || typeof dest.xrot != 'undefined')
				command("tp "+this.selector+" "+dest.x+" "+dest.y+" "+dest.z);
			else
				command("tp "+this.selector+" "+dest.x+" "+dest.y+" "+dest.z+" "+dest.yrot+" "+dest.xrot);
		}
	}
	this.clear = function(item, data, maxCount, dataTag)
	{
		item = item || '';
		data = data || '';
		maxCount = maxCount || '';
		dataTag = dataTag || '';
		command("clear "+this.selector+" "+item+" "+data+" "+maxCount+" "+dataTag);
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

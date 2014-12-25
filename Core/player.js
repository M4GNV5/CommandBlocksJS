//region player.js
function Player(selector)
{
	selector = selector || Selector.allPlayer();
	this.selector = Selector.parse(selector);

	this.setGameMode = function(mode)
	{
		command("gamemode " + mode + " " + this.selector);
	}
	this.teleport = function(dest)
	{
		if (typeof dest == 'string')
		{
			command("tp " + this.selector + " " + dest);
		}
		else
		{
			if (typeof dest.yrot == 'undefined' || typeof dest.xrot != 'undefined')
				command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z);
			else
				command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z + " " + dest.yrot + " " + dest.xrot);
		}
	}
	this.clear = function(item, data, maxCount, dataTag)
	{
		item = item || '';
		data = data || '';
		maxCount = maxCount || '';
		dataTag = dataTag || '';
		command("clear " + this.selector + " " + item + " " + data + " " + maxCount + " " + dataTag);
	}
	this.tell = function(text)
	{
		command("tell " + this.selector + " " + text);
	}
	this.tellraw = function(param)
	{
		if (typeof param == 'object')
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
		if (typeof team == 'object')
		{
			team.join(this.selector);
		}
		else
		{
			command("scoreboard teams join " + team + " " + this.selector);
		}
	}
	this.setScore = function(score, value)
	{
		if (typeof score == 'object')
		{
			score.set(this.selector, value);
		}
		else
		{
			command("scoreboard players set " + this.selector + " " + team + " " + value);
		}
	}
	this.addScore = function(score, value)
	{
		if (typeof score == 'object')
		{
			score.add(this.selector, value);
		}
		else
		{
			command("scoreboard players add " + this.selector + " " + team + " " + value);
		}
	}
	this.removeScore = function(score, value)
	{
		if (typeof score == 'object')
		{
			score.remove(this.selector, value);
		}
		else
		{
			command("scoreboard players remove " + this.selector + " " + team + " " + value);
		}
	}

	this.getSelector = function()
	{
		return this.selector;
	}
	this.toString = function()
	{
		return this.selector;
	}
}

function PlayerArray(name, selector, createObjective)
{
	name = name || Naming.next('array');
	this.name = name;

	var arrayScore;
	if (createObjective !== false)
		arrayScore = new Score(name, "dummy");
	else
		arrayScore = new Score(name);

	if (typeof selector != 'undefined')
		arrayScore.set(selector, 1);

	Player.call(this, arrayScore.getSelector(1));

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

var Selector = function(selectorChar, attributes)
{
	this.selectorChar = selectorChar || 'a';
	this.attributes = attributes || {};

	this.setAttribute = function(name, value)
	{
		this.attributes[name] = value;
	}
	this.setAttributes = function(newAttributes)
	{
		for (var name in newAttributes)
			this.setAttribute(name, newAttributes[name]);
	}
	this.removeAttribute = function(name)
	{
		delete this.attributes[name];
	}

	this.clone = function()
	{
		var atts = {};
		for (var key in this.attributes)
			if (this.attributes.hasOwnProperty(key))
				atts[key] = this.attributes[key];

		return new Selector(this.selectorChar, atts);
	}
	this.toString = function()
	{
		return Selector.buildSelector(this.selectorChar, this.attributes);
	}
}
Selector.parse = function(stringSelector)
{
	stringSelector = stringSelector.toString() || "@a[]";

	var selectorChar = stringSelector[1];
	var attributes = {};

	var attributeString = stringSelector.substring(3, stringSelector.length - 1);
	var attributeArray = attributeString.split(',');
	for (var i = 0; i < attributeArray.length; i++)
	{
		var attributeSplit = attributeArray[i].split('=');
		attributes[attributeSplit[0]] = attributeSplit[1];
	}

	return new Selector(selectorChar, attributes);
}
Selector.buildSelector = function(selectorChar, attributes)
{
	attributes = attributes || {};
	var sel = "@" + selectorChar;

	if (Object.keys(attributes).length < 1)
		return sel;

	sel += "[";
	for (var key in attributes)
	{
		sel += key + "=" + attributes[key] + ",";
	}
	sel = sel.substring(0, sel.length - 1);
	sel += "]";

	return sel;
}
Selector.player = function(attributes)
{
	return Selector.buildSelector('p', attributes);
}
Selector.randomPlayer = function(attributes)
{
	return Selector.buildSelector('r', attributes);
}
Selector.allPlayer = function(attributes)
{
	return Selector.buildSelector('a', attributes);
}
Selector.entities = function(attributes)
{
	return Selector.buildSelector('e', attributes);
}
//endregion
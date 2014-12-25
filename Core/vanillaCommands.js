//region chat
function say(message)
{
	message = message || "CommandBlocksJS error invalid call 'say()'";
	command("say " + message);
}

var Formatting = new function()
{
	this.black = '§0';
	this.darkBlue = '§1';
	this.darkGreen = '§2';
	this.darkAqua = '§3';
	this.darkRed = '§4';
	this.darkPurple = '§5';
	this.gold = '§6';
	this.gray = '§7';
	this.darkGray = '§8';
	this.blue = '§9';
	this.green = '§a';
	this.aqua = '§b';
	this.red = '§c';
	this.lightPurple = '§d';
	this.yellow = '§e';
	this.white = '§f';

	this.obfuscated = '§k';
	this.bold = '§l';
	this.strikethrough = '§m';
	this.underlined = '§n';

	this.reset = '§r';
}

String.prototype.format = function(formatting)
{
	return formatText(this, formatting);
};
function formatText(text, formatting)
{
	text = text || "CommandblockJS Error: No text given to formatText function!";
	formatting = ' ' + formatting || '§c';
	var words = text.split(' ');
	text = '';
	for (var i = 0; i < words.length; i++)
	{
		text += formatting + words[i];
	}
	return text.trim();
}
//endregion

//region title
function title(target, text, isSubtitle)
{
	target = target || Selector.allPlayer();
	text = text || "No Text defined!";

	var t = new Title(text, isSubtitle);
	t.show(target);
}
function Title(text, isSubtitle)
{
	TellrawExtra.call(this, text);

	var titleType = isSubtitle ? "subtitle" : "title";

	this.show = function(player)
	{
		player = player || Selector.allPlayer();
		var json = JSON.stringify(this.obj);
		command("title " + player + " " + titleType + " " + json);
	}

	var notSupported = function() { throw "Setting events is not supported for titles"; };
	this.setClickEvent = notSupported;
	this.setHoverEvent = notSupported;
}
Title.prototype = Object.create(TellrawExtra.prototype);

Title.setTime = function(player, fadeIn, stay, fadeOut)
{
	player = player || Selector.allPlayer();
	command("title " + player + " times " + fadeIn + " " + stay + " " + fadeOut);
}
Title.reset = function(player)
{
	player = player || Selector.allPlayer();
	command("title " + player + " reset");
}
Title.clear = function(player)
{
	player = player || Selector.allPlayer();
	command("title " + player + " clear");
}
//endregion title

//region scoreboard
function Score(name, type, displayName, addObjective)
{
	name = name || Naming.next("score");
	if (name.length > 16)
		throw "Cannot create Score with name '" + name + "' maximum name length is 16";
	displayName = displayName || name;
	if (typeof type != 'undefined' && addObjective !== false)
		command("scoreboard objectives add " + name + " " + type + " " + displayName);

	this.name = name;
	this.type = type;
	this.displayName = displayName;

	this.set = function(player, value)
	{
		command("scoreboard players set " + player + " " + name + " " + value);
	}
	this.add = function(player, value)
	{
		command("scoreboard players add " + player + " " + name + " " + value);
	}
	this.remove = function(player, value)
	{
		command("scoreboard players remove " + player + " " + name + " " + value);
	}
	this.reset = function(player)
	{
		command("scoreboard players reset " + player + " " + name);
	}
	this.setDisplay = function(slot)
	{
		command("scoreboard objectives setdisplay " + slot + " " + name);
	}
	this.enableTrigger = function(player)
	{
		if (this.type != 'trigger')
			throw "Cannot enable trigger for non Trigger objective '" + name + "'";

		command("scoreboard players enable " + player + " " + name);
	}
	this.test = function(player, callback, min, max)
	{
		min = min || 1;
		max = max || '';
		var cmd = "scoreboard players test " + player + " " + name + " " + min + " " + max;
		validate(cmd, callback);
	}
	this.operation = function(player, operation, otherPlayer, otherObjective)
	{
		command("scoreboard players operation " + player + " " + name + " " + operation + " " + otherPlayer + " " + otherObjective);
	}

	this.getSelector = function(min, max)
	{
		var minKey = "score_" + name + "_min";
		var maxKey = "score_" + name;

		var attributes = {};
		attributes[minKey] = min;

		if (typeof max != 'undefined')
			attributes[maxKey] = max;

		return new Selector("a", attributes);
	}
	this.getPlayer = function(min, max)
	{
		var reference = this.getSelector(min, max);
		return new PlayerArray(name, reference);
	}
}
function Team(name, addTeam)
{
	name = name || Naming.next("team");
	addTeam = addTeam || true;
	if (addTeam !== false)
		command("scoreboard teams add " + name);

	this.name = name;

	this.empty = function()
	{
		command("scoreboard teams empty " + name);
	}
	this.join = function(player)
	{
		command("scoreboard teams join " + name + " " + player);
	}
	this.leave = function(player)
	{
		command("scoreboard teams leave " + name + " " + player);
	}
	this.setOption = function(option, value)
	{
		command("scoreboard teams option " + name + " " + option + " " + value);
	}

	this.getSelector = function()
	{
		return new Selector("a", { team: name });
	}
	this.getPlayer = function()
	{
		var reference = this.getSelector();
		return new PlayerArray(name, reference);
	}
}
//endregion
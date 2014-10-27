//region chat
function tellraw(target, message)
{
	target = target || "@a";

	if(typeof message == 'string')
	{
		command('tellraw '+target+' {"text":"'+message+'"}');
		return;
	}

	this.extras = [];

	this.addText = function(text)
	{
		this.extras.push({"text": text});
	}
	this.addScore = function(selector, objective)
	{
		this.extras.push({"score": {"name": selector, "objective": objective}});
	}
	this.addSelector = function(selector)
	{
		this.extras.push({"selector": selector});
	}
	this.addExtra = function(extra)
	{
		this.extras.push(extra.obj);
	}

	this.tell = function(selector)
	{
		var extrasArray = JSON.stringify(this.extras);
		command('tellraw '+selector+' {"text":"",extra:'+extrasArray+'}');
	}
}
function TellrawExtra(text)
{
	text = text || ""
	this.obj = {"text": text};

	this.setText = function(newText)
	{
		this.setOption("text", newText);
	}
	this.setClickEvent = function(action, value)
	{
		this.setOption("clickEvent", {"action": action, "value": value});
	}
	this.setHoverEvent = function(action, value)
	{
		this.setOption("clickEvent", {"action": action, "value": value});
	}
	this.setColor = function(color)
	{
		this.setOption("color", color);
	}

	this.setOption = function(name, value)
	{
		this.obj[name] = value;
	}
}

function say(message)
{
	message = message || "CommandBlocksJS error invalid call 'say();'";
	command("say "+message);
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
	for(var i = 0; i < words.length; i++)
	{
		text += formatting + words[i];
	}
	return text.trim();
}
//endregion



//region scoreboard
function Score(name, type, displayName, addObjective)
{
	if(typeof name == 'undefined')
		throw 'Error cant create Score without name';
	displayName = displayName || name;
	if(typeof type != 'undefined' && addObjective !== false)
		command("scoreboard objectives add "+name+" "+type+" "+displayName);

	this.name = name;
	this.type = type;
	this.displayName = displayName;

	this.set = function(player, value)
	{
		command("scoreboard players set "+player+" "+name+" "+value);
	}
	this.add = function(player, value)
	{
		command("scoreboard players add "+player+" "+name+" "+value);
	}
	this.remove = function(player, value)
	{
		command("scoreboard players remove "+player+" "+name+" "+value);
	}
	this.reset = function(player)
	{
		command("scoreboard players reset "+player+" "+name);
	}
	this.setDisplay = function(slot)
	{
		command("scoreboard objectives setdisplay "+slot+" "+name);
	}
	this.enableTrigger = function(selector)
	{
		if(this.type != 'trigger')
			throw "Cannot enable trigger for non Trigger objective '"+name+"'";

		command("scoreboard players enable "+selector+" "+name);
	}
	this.test = function(player, callback, min, max)
	{
		min = min || 1;
		max = max || '';
		var cmd = "scoreboard players test "+player+" "+name+" "+min+" "+max;
		validate(cmd, callback);
	}
	this.operation = function(player, operation, otherPlayer, otherObjective)
	{
		command("scoreboard players operation "+player+" "+name+" "+operation+" "+otherPlayer+" "+otherObjective);
	}

	this.getSelector = function(min, max)
	{
		if(typeof max == 'undefined')
			return "@a[score_"+name+"_min="+min+"]";
		else
			return "@a[score_"+name+"_min="+min+",score_"+name+"="+max+"]"
	}
	this.getPlayer = function(min, max)
	{
		var reference = this.getSelector(min, max);
		return new PlayerArray(name, reference);
	}
}
function Team(name, addTeam)
{
	if(typeof name == 'undefined')
		throw 'Error cant create Score without name';
	addTeam = addTeam || true;
	if(addTeam !== false)
		command("scoreboard teams add "+name);

	this.name = name;

	this.empty = function()
	{
		command("scoreboard teams empty "+name);
	}
	this.join = function(player)
	{
		command("scoreboard teams join "+name+" "+player);
	}
	this.leave = function(player)
	{
		command("scoreboard teams leave "+name+" "+player);
	}
	this.setOption = function(option, value)
	{
		command("scoreboard teams option "+name+" "+option+" "+value);
	}

	this.getSelector = function()
	{
		return "@a[team="+name+"]";
	}
	this.getPlayer = function()
	{
		var reference = this.getSelector();
		return new PlayerArray(name, reference);
	}
}
//endregion

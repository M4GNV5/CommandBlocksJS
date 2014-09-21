//region chat
function tellraw(target, message)
{
	target = target || "@a";
	message = message || "CommandBlocksJS error invalid call 'tellraw();'";
	command('tellraw '+target+' {"text":"'+message+'"}');
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
function formatText(text, formatting)
{
	text = text || "CommandblockJS Error: No text givent to formatText function!";
	formatting = ' ' + formatting || '§c';
	var words = text.split(' ');
	text = '';
	for(var i = 0; i < words.length; i++)
	{
		text += formatting + words[i];
	}
	return text.trim();
}
//enregion



//region scoreboard
function Score(name, type)
{
	if(typeof name == 'undefined')
		throw 'Error cant create Score without name';
	if(typeof type != 'undefined')
		command("scoreboard objectives add "+name+" "+name+" "+type);

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
	this.setdisplay = function(slot)
	{
		command("scoreboard objectives setdisplay "+slot+" "+name);
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
}
function Team(name, addTeam)
{
	addTeam = addTeam || true;
	if(addTeam !== false)
		command("scoreboard teams add "+name);

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
}
//enregion

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

function Formatting()
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
//enregion

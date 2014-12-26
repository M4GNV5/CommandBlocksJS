/// <reference path="base.ts"/>
/// <reference path="test.ts"/>
/// <reference path="tellraw.ts"/>

//region chat
function say(message: string)
{
	command("say " + message);
}

var Formatting =
	{
		black: "§0",
		darkBlue: "§1",
		darkGreen: "§2",
		darkAqua: "§3",
		darkRed: "§4",
		darkPurple: "§5",
		gold: "§6",
		gray: "§7",
		darkGray: "§8",
		blue: "§9",
		green: "§a",
		aqua: "§b",
		red: "§c",
		lightPurple: "§d",
		yellow: "§e",
		white: "§f",
		obfuscated: "§k",
		bold: "§l",
		strikethrough: "§m",
		underlined: "§n",
		reset: "§r"
	};

interface String
{
	format(formatting: string): string;
}

String.prototype.format = function (formatting: string): string
{
	return formatText(this, formatting);
};

function formatText(text: string, formatting: string = "§c"): string
{
	var words = text.split(" ");
	text = "";
	for (var i = 0; i < words.length; i++)
	{
		text += formatting + words[i];
	}
	return text.trim();
}
//endregion

//region title
function title(target, text, isSubtitle): Title
{
	target = target || Selector.allPlayer();
	text = text || "No Text defined!";

	var t = new Title(text, isSubtitle);
	t.show(target);
	return t;
}

enum TitleType
{
	Subtitle, Title
}

class Title extends TellrawExtra
{
	titleType: TitleType;

	constructor(text: string, type: TitleType)
	{
		super(text);

		this.titleType = type;

		super.setClickEvent = function () { throw "Setting events is not supported for titles"; };
		super.setHoverEvent = function () { throw "Setting events is not supported for titles"; };
	}

	show(player: string = Selector.allPlayer()): void
	{
		var json = JSON.stringify(this.obj);
		command("title " + player + " " + this.titleType.toString().toLowerCase() + " " + json);
	}

	static setTime(player: string = Selector.allPlayer(), fadeIn: number = 1, stay: number = 5, fadeOut: number = 1): void
	{
		command("title " + player + " times " + fadeIn + " " + stay + " " + fadeOut);
	}

	static reset(player: string = Selector.allPlayer()): void
	{
		command("title " + player + " reset");
	}

	static clear(player: string = Selector.allPlayer()): void
	{
		command("title " + player + " clear");
	}
}
//endregion title

//region scoreboard
class Score
{
	name: string;
	type: string;
	displayName: string;

	constructor(name: string = Naming.next("score"), type: string = "dummy", displayName: string = undefined, addObjective: boolean = true)
	{
		if (displayName === undefined)
			displayName = name;
		assert(name.length <= 16, "Cannot create Score with name \"" + name + "\" maximum name length is 16");
		if (addObjective)
			command("scoreboard objectives add " + name + " " + type + " " + displayName);

		this.name = name;
		this.type = type;
		this.displayName = displayName;
	}

	set(player: string, value: number): void
	{
		command("scoreboard players set " + player + " " + this.name + " " + value);
	}

	add(player: string, value: number): void
	{
		command("scoreboard players add " + player + " " + this.name + " " + value);
	}

	remove(player: string, value: number): void
	{
		command("scoreboard players remove " + player + " " + this.name + " " + value);
	}

	reset(player: string): void
	{
		command("scoreboard players reset " + player + " " + this.name);
	}

	setDisplay(slot: string): void
	{
		command("scoreboard objectives setdisplay " + slot + " " + this.name);
	}

	enableTrigger(player: string): void
	{
		if (this.type != "trigger")
			throw "Cannot enable trigger for non Trigger objective \"" + this.name + "\"";

		command("scoreboard players enable " + player + " " + this.name);
	}

	test(player: string, callback: Function, min: number = 1, max: number = 2147483648): void
	{
		validate("scoreboard players test " + player + " " + this.name + " " + min + " " + max, callback);
	}

	operation(player: string, operation: string, otherPlayer: string, otherObjective: string): void
	{
		command("scoreboard players operation " + player + " " + this.name + " " + operation + " " + otherPlayer + " " + otherObjective);
	}

	getSelector(min: number, max?: number): Selector
	{
		var minKey = "score_" + this.name + "_min";
		var maxKey = "score_" + this.name;

		var attributes = {};
		attributes[minKey] = min;

		if (typeof max != "undefined")
			attributes[maxKey] = max;

		return new Selector("a", attributes);
	}

	getPlayer(min: number, max?: number): PlayerArray
	{
		var reference = this.getSelector(min, max);
		return new PlayerArray(this.name, reference.toString());
	}
}
class Team
{
	name: string;

	constructor(name: string = Naming.next("team"), addTeam: boolean = true)
	{
		this.name = name;
		if (addTeam)
			command("scoreboard teams add " + this.name);
	}

	empty(): void
	{
		command("scoreboard teams empty " + this.name);
	}

	join(player: string): void
	{
		command("scoreboard teams join " + this.name + " " + player);
	}

	leave(player: string): void
	{
		command("scoreboard teams leave " + this.name + " " + player);
	}

	setOption(option: string, value: string): void
	{
		command("scoreboard teams option " + this.name + " " + option + " " + value);
	}

	getSelector(): Selector
	{
		return new Selector("a", { team: this.name });
	}

	getPlayer(): PlayerArray
	{
		var reference = this.getSelector();
		return new PlayerArray(this.name, reference.toString());
	}
}
//endregion
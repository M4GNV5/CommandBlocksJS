/// <reference path="base.ts"/>
/// <reference path="vanillaCommands.ts"/>
/// <reference path="tellraw.ts"/>

enum GameMode
{
	Survival,
	Creative,
	Adventure,
	Spectator
}

//region player.js
class Player
{
	selector: Selector;
	constructor(selector: any)
	{
		if (typeof selector == "string")
			this.selector = Selector.parse(selector);
		else if (selector instanceof Selector)
			this.selector = selector;
		else
			throw "Unsupported Selector type";
	}

	setGameMode(mode: GameMode): void
	{
		command("gamemode " + mode.toString() + " " + this.selector);
	}

	teleport(dest): void
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

	clear(item: string = "", data: string = "", maxCount: string = "", dataTag: string = ""): void
	{
		command("clear " + this.selector + " " + item + " " + data + " " + maxCount + " " + dataTag);
	}

	tell(text: string): void
	{
		command("tell " + this.selector + " " + text);
	}

	tellraw(param): void
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

	setTeam(team): void
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

	setScore(score, value: number): void
	{
		if (typeof score == 'object')
		{
			score.set(this.selector, value);
		}
		else
		{
			command("scoreboard players set " + this.selector + " " + score + " " + value);
		}
	}

	addScore(score, value: number): void
	{
		if (typeof score == 'object')
		{
			score.add(this.selector, value);
		}
		else
		{
			command("scoreboard players add " + this.selector + " " + score + " " + value);
		}
	}

	removeScore(score, value: number): void
	{
		if (typeof score == 'object')
		{
			score.remove(this.selector, value);
		}
		else
		{
			command("scoreboard players remove " + this.selector + " " + score + " " + value);
		}
	}

	getSelector(): Selector
	{
		return this.selector;
	}

	toString(): string
	{
		return this.selector.toString();
	}
}

class PlayerArray extends Player
{
	name: string;
	arrayScore: Score;

	constructor(name: string = Naming.next('array'), selector?: string, createObjective: boolean = true)
	{
		if (typeof selector != 'undefined')
			this.arrayScore.set(selector, 1);
		selector = selector || Selector.allPlayer();

		super(selector.toString());

		this.name = name;

		if (createObjective)
			this.arrayScore = new Score(name, "dummy");
		else
			this.arrayScore = new Score(name);

		Player.call(this, this.arrayScore.getSelector(1));
	}

	addPlayer(selector: string = this.getSelector().toString()): void
	{
		this.arrayScore.set(selector.toString(), 1);
	}

	removePlayer(selector: string = this.getSelector().toString()): void
	{
		this.arrayScore.set(selector.toString(), 0);
	}

	getScore(): Score
	{
		return this.arrayScore;
	}

	toTeam(teamname: string = this.name): Team
	{
		var team = new Team(teamname);
		team.join(this.selector.toString());
		return team;
	}
}

class Selector
{
	selectorChar: string;
	attributes;

	constructor(selectorChar: string = "a", attributes = {})
	{
		this.selectorChar = selectorChar;
		this.attributes = attributes;
	}

	setAttribute(name: string, value: string): void
	{
		this.attributes[name] = value;
	}

	setAttributes(newAttributes: { string?: string }): void
	{
		for (var name in newAttributes)
			this.setAttribute(name, newAttributes[name]);
	}

	removeAttribute(name: string): void
	{
		delete this.attributes[name];
	}

	clone(): Selector
	{
		var atts = {};
		for (var key in this.attributes)
			if (this.attributes.hasOwnProperty(key))
				atts[key] = this.attributes[key];

		return new Selector(this.selectorChar, atts);
	}

	toString(): string
	{
		return Selector.buildSelector(this.selectorChar, this.attributes);
	}

	static parse(stringSelector: string): Selector
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

	static buildSelector(selectorChar: string, attributes: { string?: string } = {}): string
	{
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

	static player(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("p", attributes);
	}

	static randomPlayer(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("r", attributes);
	}

	static allPlayer(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("a", attributes);
	}

	static entities(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("e", attributes);
	}
}
//endregion
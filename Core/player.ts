//#player.ts

/// <reference path="base.ts"/>
/// <reference path="vanillaCommands.ts"/>
/// <reference path="tellraw.ts"/>

/**
 * All /gamemode modes represented in Minecraft as of 1.8.
 */
enum GameMode
{
	Survival,
	Creative,
	Adventure,
	Spectator
}

//region player.js

/**
 * Mid level wrapper for player functions.
 */
class Player
{
	/** Selector to identify the player for Minecraft commands. */
	selector: Selector;

	/**
	 * @param selector Selector to the player. Either string or Selector.
	 */
	constructor(selector: any)
	{
		if (typeof selector == "string")
			this.selector = Selector.parse(selector);
		else if (selector instanceof Selector)
			this.selector = selector;
		else
			throw "Unsupported Selector type";
	}

	/**
	 * Sets the players gamemode.
	 */
	setGameMode(mode: GameMode): void
	{
		command("gamemode " + mode.toString() + " " + this.selector);
	}

	/**
	 * Teleports the player to a destination.
	 * @param dest Either raw string or position serialized with x, y, z, [yrot, xrot].
	 */
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

	/**
	 * Clears the players inventory.
	 * @param item Item to clear.
	 * @param data Data/damage the item must have.
	 * @param maxCount Maximum count of items to clear.
	 * @param dataTag Stringified JSON the item NBT needs to have.
	 */
	clear(item: string = "", data: string = "", maxCount: string = "", dataTag: string = ""): void
	{
		command("clear " + this.selector + " " + item + " " + data + " " + maxCount + " " + dataTag);
	}

	/**
	 * Sends the player a message via /tell.
	 * @param text Text to send.
	 */
	tell(text: string): void
	{
		command("tell " + this.selector + " " + text);
	}

	/**
	 * Sends the player a raw message via /tellraw.
	 * @param param Message to send. Either Tellraw or string.
	 */
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

	/**
	 * Lets the player join a Team.
	 * @param team Target team. Either Team or string.
	 */
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

	/**
	 * Sets the players score in a scoreboard.
	 * @param score The scoreboard to set. Either Scoreboard or string.
	 * @param value The value to set to.
	 */
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

	/**
	 * Adds a value to the players score in a scoreboard.
	 * @param score The scoreboard to set. Either Scoreboard or string.
	 * @param value The value to set to.
	 */
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

	/**
	 * Removes the value from the players score in a scoreboard.
	 * @param score The scoreboard to set. Either Scoreboard or string.
	 * @param value The value to set to.
	 */
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

	/**
	 * Returns the selector to get this player.
	 */
	getSelector(): Selector
	{
		return this.selector;
	}

	/**
	 * Returns getSelector().toString()
	 */
	toString(): string
	{
		return this.selector.toString();
	}
}

/**
 * A dynamic list of players.
 */
class PlayerArray extends Player
{
	/**
	 * Name of the scoreboard to save the players.
	 */
	name: string;

	/**
	 * Scoreboard containing the players.
	 */
	arrayScore: Score;

	/**
	 * @param name Name of the scoreboard to save the players.
	 * @param selector Initial players to add.
	 * @param createObjective Set to false if scoreboard already exists.
	 */
	constructor(name: string = Naming.next('array'), selector: string = Selector.allPlayer(), createObjective: boolean = true)
	{
		super(selector.toString());

		if (typeof selector != 'undefined')
			this.arrayScore.set(selector, 1);

		this.name = name;

		if (createObjective)
			this.arrayScore = new Score(name, "dummy");
		else
			this.arrayScore = new Score(name);

		Player.call(this, this.arrayScore.getSelector(1));
	}

	/**
	 * Adds a player to the array.
	 * @param selector Target player.
	 */
	addPlayer(selector: string = this.getSelector().toString()): void
	{
		this.arrayScore.set(selector.toString(), 1);
	}

	/**
	 * Removes a player from the array.
	 * @param selector Target player.
	 */
	removePlayer(selector: string = this.getSelector().toString()): void
	{
		this.arrayScore.set(selector.toString(), 0);
	}

	/**
	 * Returns the scoreboard associated with this array.
	 */
	getScore(): Score
	{
		return this.arrayScore;
	}

	/**
	 * Converts the array to a team.
	 * @param teamname Name of the team.
	 */
	toTeam(teamname: string = this.name): Team
	{
		var team = new Team(teamname);
		team.join(this.selector.toString());
		return team;
	}
}

/**
 * Selector wrapper for targeting entities and players.
 */
class Selector
{
	/** Selector Character. In range [aerp]. */
	selectorChar: string;

	/** Key-Value JSON serialized attributes. Modify using setAttribute(s), removeAttribute. */
	attributes;

	constructor(selectorChar: string = "a", attributes = {})
	{
		this.selectorChar = selectorChar;
		this.attributes = attributes;
	}

	/** Sets a attribute to some value. */
	setAttribute(name: string, value: string): void
	{
		this.attributes[name] = value;
	}

	/** Merges this.attributes with newAttributes. */
	setAttributes(newAttributes: { string?: string }): void
	{
		for (var name in newAttributes)
			this.setAttribute(name, newAttributes[name]);
	}

	/** Removes a attribute by name. */
	removeAttribute(name: string): void
	{
		delete this.attributes[name];
	}

	/** Creates a copy of this selector instance. */
	clone(): Selector
	{
		var atts = {};
		for (var key in this.attributes)
			if (this.attributes.hasOwnProperty(key))
				atts[key] = this.attributes[key];

		return new Selector(this.selectorChar, atts);
	}

	/** Creates the selector. (e.g. "@p[r=5,m=2]"). */
	toString(): string
	{
		return Selector.buildSelector(this.selectorChar, this.attributes);
	}

	/** Creates a selector from a string. */
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

	/** Converts a selector to a string. (See Selector.toString). */
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

	/** Constant @p string with attributes. */
	static player(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("p", attributes);
	}

	/** Constant @r string with attributes. */
	static randomPlayer(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("r", attributes);
	}

	/** Constant @a string with attributes. */
	static allPlayer(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("a", attributes);
	}

	/** Constant @e string with attributes. */
	static entities(attributes: { string?: string } = {}): string
	{
		return Selector.buildSelector("e", attributes);
	}
}
//endregion
/// <reference path="../API.ts"/>

import Selector = Entities.Selector;

module Scoreboard
{
	export class Objective
	{
		type: ObjectiveType;
		criteria: string;
		name: string;
		displayName: string;

		constructor(criteria: ObjectiveType = ObjectiveType.dummy, name: string = Util.Naming.next("score"), displayName?: string)
		{
			this.displayName = displayName || name;
			this.name = name;

			this.criteria = criteria.value;

			command("scoreboard objectives add " + this.name + " " + this.criteria + " " + this.displayName);
		}

		set(selector: Selector, value: number): void
		{
			command("scoreboard players set " + selector + " " + this.name + " " + value);
		}
		add(selector: Selector, value: number): void
		{
			command("scoreboard players add " + selector + " " + this.name + " " + value);
		}
		remove(selector: Selector, value: number): void
		{
			command("scoreboard players remove " + selector + " " + this.name + " " + value);
		}

		static reset(selector: Selector): void
		{
			command("scoreboard players reset "+selector);
		}
		reset(selector: Selector): void
		{
			command("scoreboard players reset " + selector + " " + this.name);
		}

		static clearDisplay(slot: DisplaySlot): void
		{
			command("scoreboard objectives setdisplay " + slot);
		}
		setDisplay(slot: DisplaySlot): void
		{
			command("scoreboard objectives setdisplay " + DisplaySlot[slot] + " " + this.name);
		}

		test(selector: Selector, valueMin: number = -2147483648, valueMax: number = 2147483647): MinecraftCommand
		{
			return new MinecraftCommand("scoreboard players test " + selector + " " + this.name + " " + valueMin + " " + valueMax);
		}
		operation(selector: Selector, otherObjective: Objective = this, otherPlayer: Selector = selector, operation: string = "=")
		{
			command("scoreboard players operation " + selector + " " + this.name + " " + operation + " " + otherPlayer + " " + otherObjective.name);
		}
		enableTrigger(selector: Selector): void
		{
			command("scoreboard players enable " + selector + " " + this.name);
		}
	}
}

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

		constructor(type: ObjectiveType = ObjectiveType.dummy, subCriteria?: any, name: string = Naming.next("score"), displayName?: string)
		{
			this.displayName = displayName || name;
			this.name = name;
			this.criteria = type + (subCriteria || "").toString();

			command("scoreboard objectives add " + this.name + " " + this.criteria + " " + this.displayName);
		}

		set(selector: Selector, value: number)
		{

		}
		add(selector: Selector, value: number)
		{

		}
		remove(selector: Selector, value: number)
		{

		}

		reset(selector?: Selector)
		{
			
		}

		enableTrigger(selector: Selector)
		{

		}
		setDisplay(slot: DisplaySlots)
		{

		}

		test(selector: Selector, valueMin: number, valueMax: number = 2147483647)
		{
			
		}
	}
}

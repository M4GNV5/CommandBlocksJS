/// <reference path="../API.ts"/>

module Scoreboard
{
	export class Team
	{
		name: string;

		constructor(name: string = Util.Naming.next("team"), displayName: string = "")
		{
			this.name = name;
		}

		empty()
		{
			command("scoreboard teams empty " + this.name);
		}

		join(selector: Selector)
		{
			command("scoreboard teams join " + this.name + " " + selector);
		}

		static leave(selector: Selector)
		{
			command("scoreboard teams leave " + selector);
		}
		leave(selector: Selector)
		{
			command("scoreboard teams leave " + this.name + " " + selector);
		}

		set firendlyFire(value: boolean)
		{
			command("scoreboard teams option " + this.name + " friendlyFire " + value);
		}
		set seeFriendlyInvisibles(value: boolean)
		{
			command("scoreboard teams option " + this.name + " seeFriendlyInvisibles " + value);
		}

		set color(value: any) //TODO color class
		{
			command("scoreboard teams option " + this.name + " color " + value);
		}

		set nametagVisibility(value: Visibility)
		{
			command("scoreboard teams option " + this.name + " nametagVisibility " + value);
		}
		set deathMessageVisibility(value: Visibility)
		{
			command("scoreboard teams option " + this.name + " deathMessageVisibility " + value);
		}
	}
}

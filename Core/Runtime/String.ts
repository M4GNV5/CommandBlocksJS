/// <reference path="../API.ts"/>

module Runtime
{
	export class String implements Variable<string>
	{
		private static score: Scoreboard.Objective;
		private static lastIndex: number = 1;

		index: number;
		selector: Entities.Selector;

		constructor(value: string = Util.Naming.next("string"))
		{
			if (typeof String.score == 'undefined')
				String.score = new Scoreboard.Objective(Scoreboard.ObjectiveType.dummy, "stdStrings", "RuntimeInteger");

			this.index = String.lastIndex;

			this.selector = Entities.Selector.parse("@e[score_stdStrings_min=" + this.index + ",score_stdStrings=" + this.index + "]");

			command('kill ' + this.selector.toString());
			command('summon ArmorStand ~ ~1 ~ {CustomName:"' + value + '",NoGravity:true,Invincible:1,PersistenceRequired:1}');

			var sel = Entities.Selector.parse('@e[type=ArmorStand,name=' + value + ',r=5]');
			String.score.set(sel, String.lastIndex);
			String.lastIndex++;
		}

		set(value: string): void
		{
			command('entitydata ' + this.selector + ' {CustomName:"' + value + '"}');
		}

		isExact(value: string, callback?: Function): MinecraftCommand
		{
			var sel = Entities.Selector.parse('@e[type=ArmorStand,name=' + value + ']');
			var cmd = String.score.test(sel, this.index, this.index);

			if (typeof callback == 'function')
				cmd.validate(callback);

			return cmd;
		}

		toTellrawExtra(): Chat.TellrawSelectorExtra
		{
			return new Chat.TellrawSelectorExtra(this.selector);
		}
	}
}

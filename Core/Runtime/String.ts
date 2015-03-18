/// <reference path="../API.ts"/>

module Runtime
{
	export class String implements Variable<string>
	{
		static score: Scoreboard.Objective = new Scoreboard.Objective(Scoreboard.ObjectiveType.dummy, "stdStrings", "RuntimeString", false);
		private static lastIndex: number = 1;

		index: number;
		selector: Entities.Selector;

		constructor(value: string = Util.Naming.next("string"))
		{
			usedLibs["string"] = true;

			this.index = String.lastIndex;

			this.selector = Entities.Selector.parse("@e[score_stdStrings_min=" + this.index + ",score_stdStrings=" + this.index + "]");

			command('kill ' + this.selector.toString());
			command('summon ArmorStand ~ ~1 ~ {CustomName:"' + value + '",NoGravity:true,Invincible:true,PersistenceRequired:true}');

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

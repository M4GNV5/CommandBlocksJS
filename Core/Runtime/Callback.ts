/// <reference path="../API.ts"/>

module Runtime
{
	export class Callback implements Variable<Function>
	{
		private static score: Scoreboard.Objective;
		private static lastValue: number = 1;

		private value: number;

		constructor()
		{
			if (typeof Callback.score == 'undefined')
				Callback.score = new Scoreboard.Objective(Scoreboard.ObjectiveType.dummy, "callback");

			this.value = Callback.lastValue;
			Callback.lastValue++;
		}

		set(value: Function): void
		{
			this.removeAll();
			this.add(value);
		}
		add(func: Function): void
		{
			var id = outputHandler.addFunction(func);
			outputHandler.addToCurrent(new Output.FunctionTimeout(id));

			var sel = Entities.Selector.parse("@e[name=function{0}]".format(id));
			Callback.score.set(sel, this.value);
		}

		remove(func: Function): void
		{
			var id = outputHandler.addFunction(func);
			command("kill @e[score_callback_min={0},score_callback={0},name=function{1}]".format(this.value, id));
		}
		removeAll(): void
		{
			command("kill @e[score_callback_min={0},score_callback={0}]".format(this.value));
		}

		emit(): void
		{
			command("execute @e[score_callback_min={0},score_callback={0}] ~ ~ ~ setblock ~ ~ ~ minecraft:redstone_block".format(this.value));
		}

		isExact(value: Function, callback?: Function): MinecraftCommand
		{
			return this.isListener(value, callback);
		}
		isListener(value: Function, callback?: Function): MinecraftCommand
		{
			var id = outputHandler.addFunction(value);
			var cmd = new MinecraftCommand("testfor @e[score_callback_min={0},score_callback={0},name=function{1}]".format(this.value, id));

			if (typeof callback == 'function')
				cmd.validate(callback);

			return cmd;
		}

		toTellrawExtra(): Chat.TellrawSelectorExtra
		{
			var sel = Entities.Selector.parse("@e[score_callback_min={0},score_callback={0}]".format(this.value));
			return new Chat.TellrawSelectorExtra(sel);
		}
	}
}
 
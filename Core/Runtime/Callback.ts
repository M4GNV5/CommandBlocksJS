/// <reference path="../API.ts"/>

module Runtime
{
	export class Callback implements Variable<Function>
	{
		private static score: Scoreboard.Objective;
		private static lastValue: number = 1;

		private identifierValue: number;

		constructor()
		{
			if (typeof Callback.score == 'undefined')
				Callback.score = new Scoreboard.Objective(Scoreboard.ObjectiveType.dummy, "callback");

			this.identifierValue = Callback.lastValue;
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
			outputHandler.addToCurrent(new Output.FunctionCall(id, Output.FunctionCall.timeoutCommand.format(id)));

			var sel = Entities.Selector.parse("@e[name=function{0}]".format(id));
			Callback.score.set(sel, this.identifierValue);
		}

		remove(func: Function): void
		{
			var id = outputHandler.addFunction(func);
			command("kill @e[score_callback_min={0},score_callback={0},name=function{1}]".format(this.identifierValue, id));
		}
		removeAll(): void
		{
			command("kill @e[score_callback_min={0},score_callback={0}]".format(this.identifierValue));
		}

		emit(): void
		{
			command("execute @e[score_callback_min={0},score_callback={0}] ~ ~ ~ setblock ~ ~ ~ minecraft:redstone_block 0 replace".format(this.identifierValue));
		}

		isExact(value: Function, callback?: Function): MinecraftCommand
		{
			return this.hasListener(value, callback);
		}
		hasListener(value: Function, callback?: Function): MinecraftCommand
		{
			var id = outputHandler.addFunction(value);
			var cmd = new MinecraftCommand("testfor @e[score_callback_min={0},score_callback={0},name=function{1}]".format(this.identifierValue, id));

			if (typeof callback == 'function')
				cmd.validate(callback);

			return cmd;
		}

		toTellrawExtra(): Chat.TellrawSelectorExtra
		{
			var sel = Entities.Selector.parse("@e[score_callback_min={0},score_callback={0}]".format(this.identifierValue));
			return new Chat.TellrawSelectorExtra(sel);
		}
	}
}
 
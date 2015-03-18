/// <reference path="./../../API.ts"/>

module Chat
{
	export class CallbackClickEvent
	{
		static score: Scoreboard.Objective = new Scoreboard.Objective(Scoreboard.ObjectiveType.trigger, "callbackClick", undefined, false);
		static clickEventCallbacks: number[] = [];

		callback: Function;
		action: string;
		value: string;

		constructor(callback: Function)
		{
			usedLibs["callbackClickEvent"] = true;

			this.callback = callback;
		}

		intialize(): void
		{
			var id = outputHandler.addFunction(this.callback);
			this.action = "run_command";
			this.value = "/trigger callbackClick set {0}".format(id);

			command("kill @e[type=ArmorStand,name=function{0}]".format(id));

			outputHandler.addToCurrent(new Output.FunctionTimeout(id));

			CallbackClickEvent.clickEventCallbacks.push(id);
		}
	}
} 
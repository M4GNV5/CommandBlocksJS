/// <reference path="./API.ts"/>

class MinecraftCommand
{
	cmd: string;

	constructor(cmd: string)
	{
		this.cmd = cmd;
	}

	run(): void
	{
		command(this.cmd);
	}

	validate(callback?: Function, otherwise?: Function, useSetblock: boolean = false): void
	{
		usedLibs["integer"] = true;
		usedLibs["validate"] = true;

		if (!useSetblock)
			usedLibs["setTimeout"] = true;

		command("execute @e[name=validate] ~ ~ ~ " + this.cmd);

		if (typeof callback != 'undefined')
		{
			var id = outputHandler.addFunction(callback);

			if (useSetblock)
				outputHandler.addToCurrent(new Output.FunctionCall(id, Output.FunctionCall.setblockCallCommand, "@e[name=validate,score_stdInteger_min=1]"));
			else
				outputHandler.addToCurrent(new Output.FunctionCall(id, Output.FunctionCall.armorstandCallCommand, "@e[name=validate,score_stdInteger_min=1]"));
		}
		if (typeof otherwise != 'undefined')
		{
			var id = outputHandler.addFunction(otherwise);
			if (useSetblock)
				outputHandler.addToCurrent(new Output.FunctionCall(id, Output.FunctionCall.setblockCallCommand, "@e[name=validate,score_stdInteger=0]"));
			else
				outputHandler.addToCurrent(new Output.FunctionCall(id, Output.FunctionCall.armorstandCallCommand, "@e[name=validate,score_stdInteger=0]"));
		}
	}
}

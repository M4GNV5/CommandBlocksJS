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

	validate(callback: Function): void
	{
		var cmd = this.cmd;
		sidewards(function ()
		{
			queryCommand(cmd);
			comparator();
			call(callback);
		});
	}

	validateSync(): void
	{
		queryCommand(this.cmd);
		comparator();
	}
}

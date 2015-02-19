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
		var escapedCmd = cmd.replace(/"/g, '\\"');
		command('setblock ~1 ~1 ~2 minecraft:command_block 0 replace {Command:"setblock ~ ~-1 ~-2 minecraft:command_block 0 replace {Command:\\"' + escapedCmd + '\\"}"}');
		sidewards(function ()
		{
			command(cmd);
			comparator();
			call(callback);
		});
	}

	validateOnce(callback: Function): void
	{
		var cmd = this.cmd;

		sidewards(function ()
		{
			command(cmd);
			comparator();
			call(callback);
		});
	}
}

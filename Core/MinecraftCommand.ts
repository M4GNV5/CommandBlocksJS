/// <reference path="./API.ts"/>

class MinecraftCommand
{
	cmd: string;

	constructor(cmd: string)
	{
		this.cmd = cmd;
	}

	//TODO implement own output parser

	run(): void
	{
		command(this.cmd);
	}
	validate(callback: Function): void
	{
        sidewards(function ()
        {
            queryCommand(this.cmd, false);
            comparator();
            call(callback, false);
        });
	}
	validateSync(): void
	{
        queryCommand(this.cmd);
        comparator();
	}
}

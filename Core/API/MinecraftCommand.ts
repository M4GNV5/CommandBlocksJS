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
		validate(this.cmd, callback);
	}
	validateSync(): void
	{
		validateSync(this.cmd);
	}
}

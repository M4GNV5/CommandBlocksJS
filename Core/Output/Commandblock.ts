/// <reference path="./../API.ts"/>

module Output
{
	export class Commandblock implements OutputBlock
	{
		cmd: string;
		constructor(cmd: string)
		{
			this.cmd = cmd;
		}

		place(position: Util.Vector3): void
		{
			api.placeCommandBlock(this.cmd, position.x, position.y, position.z);
		}
	}
} 
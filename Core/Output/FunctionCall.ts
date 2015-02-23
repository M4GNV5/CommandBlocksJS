/// <reference path="./../API.ts"/>

module Output
{
	export class FunctionCall implements OutputBlock
	{
		id: number

		constructor(id: number)
		{
			this.id = id;
		}

		place(position: Util.Vector3): void
		{
			var ePosition = Manager.functionPositions[this.id];

			var offX = ePosition.x - position.x;
			var offY = ePosition.y - position.y - 1;
			var offZ = ePosition.z - position.z;

			var eCommand = "setblock ~" + offX + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace";

			api.placeCommandBlock(eCommand, position.x, position.y, position.z);
		}
	}
}

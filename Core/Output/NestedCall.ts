/// <reference path="./../API.ts"/>

module Output
{
	export class NestedCall implements OutputBlock
	{
		id: number
		outer: string;

		constructor(id: number, outer: string)
		{
			this.id = id;
			this.outer = outer;
		}

		place(position: Util.Vector3): void
		{
			var ePosition = Manager.functionPositions[this.id];

			var offX = ePosition.x - position.x;
			var offY = ePosition.y - position.y - 1;
			var offZ = ePosition.z - position.z;

			var eCommand = "setblock ~" + offX + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace";

			api.placeCommandBlock(this.outer.replace(/%call%/g, eCommand), position.x, position.y, position.z);
		}
	}
}
 
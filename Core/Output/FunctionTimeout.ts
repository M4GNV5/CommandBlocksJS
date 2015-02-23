/// <reference path="./../API.ts"/>

module Output
{
	export class FunctionTimeout implements OutputBlock
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

			var cmd = 'summon ArmorStand ~{0} ~{1} ~{2} {CustomName:"function{3}",Marker:1}'.format(offX, offY, offZ, this.id);
			api.placeCommandBlock(cmd, position.x, position.y, position.z);
		}
	}
}

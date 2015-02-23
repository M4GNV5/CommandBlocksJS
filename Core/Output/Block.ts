/// <reference path="./../API.ts"/>

module Output
{
	export class Block implements OutputBlock
	{
		id: number;
		data: number;

		constructor(id: number, data: number = 0)
		{
			this.id = id;
			this.data = data;
		}

		place(position: Util.Vector3): void
		{
			api.placeBlock(this.id, this.data, position.x, position.y, position.z);
		}
	}
} 
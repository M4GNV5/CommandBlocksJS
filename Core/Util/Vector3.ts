/// <reference path="./../API.ts"/>

module Util
{
	export class Vector3
	{
		x: number = 0;
		y: number = 0;
		z: number = 0;

		constructor(x, y, z)
		{
			this.x = x;
			this.y = y;
			this.z = z;
		}

		toString(separator: string = ' '): string
		{
			return this.x + separator + this.y + separator + this.z;
		}

		add(b: Vector3): Vector3
		{
			this.x += b.x;
			this.y += b.y;
			this.z += b.z;

			return this;
		}

		subtract(b: Vector3): Vector3
		{
			this.x -= b.x;
			this.y -= b.y;
			this.z -= b.z;

			return this;
		}

		clone(): Vector3
		{
			return new Vector3(this.x, this.y, this.z);
		}
	}
}

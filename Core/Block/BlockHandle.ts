/// <reference path="../API.ts"/>

module Block
{
	export class BlockHandle
	{
		x: number;
		y: number;
		z: number;
		material: string;
		data: number;

		constructor(positionOrX, materialOrY, dataOrZ, material?, data?)
		{
			if (positionOrX instanceof Util.Vector3)
			{
				var position = <Util.Vector3>positionOrX;
				this.x = position.x;
				this.y = position.y;
				this.z = position.z;
				this.material = materialOrY;
				this.data = dataOrZ;
			}
			else
			{
				this.x = positionOrX;
				this.y = materialOrY;
				this.z = dataOrZ;
				this.material = material;
				this.data = data;
			}
		}

		/**
		 * Checks if the block equals what this instance saved at compiletime. Use equals for runtime instead.
		 */
		assumeEqual(material: string, data: number = 0): boolean
		{
			return this.material == material && this.data == data;
		}

		/**
		 * Checks if the block equals material at runtime. Use assumeEqual for compiletime instead.
		 */
		equals(material: string, data: number = 0): MinecraftCommand
		{
			return new MinecraftCommand("tesforblock {0} {1} {2} {3} {4}".format(this.x, this.y, this.z, material, data));
		}

		place(oldHandling: SetBlockHandling = SetBlockHandling.Replace): void
		{
			command("setblock {0} {1} {2} {3} {4} {5}".format(this.x, this.y, this.z, this.material, this.data, oldHandling.toString()));
		}

		fill(x: number, y: number, z: number, x2: number, y2: number, z2: number, oldHandling: SetBlockHandling = SetBlockHandling.Replace): void
		{
			command("fill {0} {1} {2} {3} {4} {5} {6} {7} {8}".format(x, y, z, x2, y2, z2, this.material, this.data, oldHandling.toString()));
		}

		replace(material: string, data: number = 0, oldHandling: SetBlockHandling = SetBlockHandling.Replace): void
		{
			this.material = material;
			this.data = data;
			this.place(oldHandling);
		}
	}
}
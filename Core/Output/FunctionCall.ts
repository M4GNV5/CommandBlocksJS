/// <reference path="./../API.ts"/>

module Output
{
	export class FunctionCall implements OutputBlock
	{
		static timeoutCommand = 'summon ArmorStand ~%X ~%Y ~%Z {CustomName:"function{0}",NoGravity:true,Invincible:true,PersistenceRequired:true}';
		static callCommand = 'setblock ~%X ~%Y ~%Z minecraft:redstone_block 0 replace';

		id: number
		cmd: string;

		constructor(id: number, cmd: string = FunctionCall.callCommand)
		{
			this.id = id;
			this.cmd = cmd;
		}

		place(position: Util.Vector3): void
		{
			var ePosition = Manager.functionPositions[this.id];

			var offX = ePosition.x - position.x;
			var offY = ePosition.y - position.y - 1;
			var offZ = ePosition.z - position.z;

			var _cmd = this.cmd.replace(/%X/g, offX.toString());
			_cmd = _cmd.replace(/%Y/g, offY.toString());
			_cmd = _cmd.replace(/%Z/g, offZ.toString());

			api.placeCommandBlock(_cmd, position.x, position.y, position.z);
		}
	}
}

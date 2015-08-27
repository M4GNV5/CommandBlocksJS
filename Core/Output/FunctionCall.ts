/// <reference path="./../API.ts"/>

module Output
{
	export class FunctionCall implements OutputBlock
	{
		static timeoutCommand = 'execute %selector ~ ~ ~ summon ArmorStand ~%X ~%Y ~%Z {CustomName:"function{0}",NoGravity:true,Invincible:true,PersistenceRequired:true}';
		static armorstandCallCommand = 'execute %selector ~ ~ ~ summon ArmorStand ~%X ~%Y ~%Z {CustomName:"call",NoGravity:true,Invincible:true,PersistenceRequired:true}';
		static setblockCallCommand = 'execute %selector ~ ~ ~ setblock ~%X ~%Y ~%Z minecraft:redstone_block 0 replace';

		id: number
		cmd: string;
		selector: string;

		constructor(id: number, cmd: string = FunctionCall.setblockCallCommand, validateSelector: string = "@e[name=validate]")
		{
			this.id = id;
			this.cmd = cmd;
			this.selector = validateSelector;
		}

		place(position: Util.Vector3): void
		{
			var ePosition = Manager.functionPositions[this.id];
			var pos = ValidateIntializer.position;

			var offX = ePosition.x - pos.x;
			var offY = ePosition.y - pos.y - 1;
			var offZ = ePosition.z - pos.z;

			var _cmd = this.cmd.replace(/%X/g, offX.toString());
			_cmd = _cmd.replace(/%Y/g, offY.toString());
			_cmd = _cmd.replace(/%Z/g, offZ.toString());
			_cmd = _cmd.replace(/%selector/g, this.selector);

			api.placeCommandBlock(_cmd, position.x, position.y, position.z);
		}
	}
}

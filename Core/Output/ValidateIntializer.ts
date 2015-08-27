/// <reference path="./../API.ts"/>

module Output
{
	export class ValidateIntializer implements OutputBlock
	{
		static position: Util.Vector3;

		place(_position: Util.Vector3): void
		{
			if (typeof ValidateIntializer.position != 'undefined')
				throw "Cannot intialize validate armorstand twice";

			ValidateIntializer.position = _position.clone();
			ValidateIntializer.position.y++;
			
			api.placeCommandBlock("summon ArmorStand ~ ~1 ~ {NoGravity:1,CustomName:validate}", _position.x, _position.y, _position.z);
		}
	}
}

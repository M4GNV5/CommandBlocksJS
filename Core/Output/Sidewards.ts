/// <reference path="./../API.ts"/>

module Output
{
	export class Sidewards implements OutputBlockContainer
	{
		member: OutputBlock[] = [];

		place(position: Util.Vector3): void
		{
			var pos = Manager.position.clone();
			Manager.direction++;
			for (var i = 0; i < this.member.length; i++)
			{
				this.member[i].place(position);
				Manager.moveNext();
			}
			Manager.position = pos;
			Manager.direction--;
		}
	}
}

/// <reference path="./../API.ts"/>

module Output
{
	export class CbjsFunction implements OutputBlockContainer
	{
		member: OutputBlock[] = [];

		place(position: Util.Vector3)
		{
			for (var i = 0; i < this.member.length; i++)
			{
				
				this.member[i].place(Manager.position);
				Manager.moveNext();
			}
		}
	}
}
 
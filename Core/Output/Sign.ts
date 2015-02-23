/// <reference path="./../API.ts"/>

module Output
{
	export class Sign implements OutputBlock
	{
		text1: string;
		text2: string;
		text3: string;
		text4: string;

		orientation: number;

		constructor(text1: string, text2: string, text3: string, text4: string, orientation: number)
		{
			this.text1 = text1;
			this.text2 = text2;
			this.text3 = text3;
			this.text4 = text4;

			this.orientation = orientation;
		}

		place(position: Util.Vector3): void
		{
			var texts = [this.text1, this.text2, this.text3, this.text4];
			api.placeSign(texts, this.orientation, position.x, position.y, position.z);
		}
	}
}
 
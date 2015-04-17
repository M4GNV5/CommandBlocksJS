/// <reference path="./../API.ts"/>

declare var startPosition: Util.Vector3;

module Output
{
	export class Manager
	{
		static position: Util.Vector3;
		static currentFunction: number;

		static direction: number = 1;
		static functionPositions: Util.Vector3[] = [];
		static functions: Output.CbjsFunction[] = [];

		static start(): void
		{
			this.position = startPosition;

			var maxLength = 0;
			for (var i = 0; i < this.functions.length; i++)
			{
				if (this.functions[i].member.length > maxLength)
				{
					maxLength = this.functions[i].member.length;
				}
			}

			var usedFuncs: CbjsFunction[] = [];
			for (var i = 0; i < this.functions.length; i++)
			{
				if (usedFuncs.indexOf(this.functions[i]) !== -1)
					continue;

				this.functionPositions[i] = this.position.clone();
				var length: number = this.functions[i].member.length;
				usedFuncs.push(this.functions[i]);

				if (length + 1 < maxLength)
				{
					for (var ii = 0; ii < this.functions.length; ii++)
					{
						var otherLength = this.functions[ii].member.length;

						if (length + otherLength + 1 < maxLength && usedFuncs.indexOf(this.functions[ii]) === -1)
						{	
							usedFuncs.push(this.functions[ii]);

							this.functionPositions[ii] = this.position.clone();
							this.functionPositions[ii].x += length + 1;

							length += otherLength + 1;
						}
					}
				}

				this.position.z += 2;
			}

			for (var i = 0; i < this.functions.length; i++)
			{
				this.currentFunction = i;
				this.position = this.functionPositions[i].clone();
				this.functions[i].place(this.position);
			}

			api.save();
		}

		static moveNext()
		{
			this.position.x++;
		}

		static updatePosition(xMinus: Function, xPlus: Function, zMinus: Function, zPlus: Function): void
		{
			switch (Manager.direction)
			{
				case 0:
					zMinus();
					break;
				case 1:
					xPlus();
					break;
				case 2:
					zPlus();
					break;
				case 3:
					xMinus();
					break;
			}
		}
	}
}

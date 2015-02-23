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

			for (var i = 0; i < Manager.functions.length; i++)
			{
				this.functionPositions[i] = this.position.clone();

				var sidewards = 2;
				for (var ii = 0; ii < this.functions[i].member.length; ii++)
				{
					if (this.functions[i].member[ii] instanceof Sidewards)
					{
						var _sidewards = (<Sidewards>this.functions[i].member[ii]).member.length + 1;
						if (_sidewards > sidewards)
						{
							sidewards = _sidewards;
						}
					}
				}

				Manager.updatePosition(
					function () { Manager.position.z -= sidewards; },
					function () { Manager.position.z += sidewards; },
					function () { Manager.position.z -= sidewards; },
					function () { Manager.position.z += sidewards; }
					);
			}

			for (var i = 0; i < Manager.functions.length; i++)
			{
				this.currentFunction = i;
				this.position = this.functionPositions[i].clone();
				this.functions[i].place(this.position);
			}

			api.save();
		}

		static moveNext()
		{
			Manager.updatePosition(
				function () { Manager.position.x -= 1; },
				function () { Manager.position.x += 1; },
				function () { Manager.position.z -= 1; },
				function () { Manager.position.z += 1; }
				);
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

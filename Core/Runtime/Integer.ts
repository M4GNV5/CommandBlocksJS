/// <reference path="../API.ts"/>

module Runtime
{
	export class Integer
	{
		private static score: Scoreboard.Objective;

		selector: Entities.Selector;

		constructor(value?: number, name?: string)
		constructor(value?: number, selector?: Entities.Selector)
		constructor(value: number = 0, selector: any = Util.Naming.next("int"))
		{
			if (typeof Integer.score == 'undefined')
				Integer.score = new Scoreboard.Objective(Scoreboard.ObjectiveType.dummy, undefined, "std.integer", "RuntimeInteger");

			if (selector instanceof Entities.Selector)
				this.selector = selector;
			else
				this.selector = Entities.Selector.parse(selector.toString());

			this.set(value);
		}
		
		set(value: number): void
		{
			Integer.score.set(this.selector, value);
		}
		add(value: number): void
		{
			Integer.score.add(this.selector, value);
		}
		remove(value: number): void
		{
			Integer.score.remove(this.selector, value);
		}
		reset(): void
		{
			Integer.score.reset(this.selector);
		}

		operation(operation: Scoreboard.MathOperation, other: number)
		operation(operation: Scoreboard.MathOperation, other: Runtime.Integer)
		operation(operation: Scoreboard.MathOperation, other: Scoreboard.Objective, otherPlayer: Entities.Selector)
		operation(operation: Scoreboard.MathOperation, other: any, otherPlayer?: Entities.Selector)
		{
			var _other: Scoreboard.Objective;

			if (other instanceof Number)
			{
				var int = new Runtime.Integer(<number>other);
				_other = Integer.score;
				otherPlayer = int.selector;
			}
			else if (other instanceof Runtime.Integer)
			{
				_other = Integer.score;
				otherPlayer = other.selector;
			}
			else
			{
				_other = other;
			}

			Integer.score.operation(this.selector, _other, otherPlayer, operation);
		}

		isExact(value: number, callback?: Function): MinecraftCommand
		{
			return this.isBetween(value, value, callback);
		}
		isBetween(min: number = 0, max?: number, callback?: Function): MinecraftCommand
		{
			var cmd = Integer.score.test(this.selector, min, max);

			if (typeof callback == 'function')
				cmd.validate(callback);

			return cmd;
		}
	}
}

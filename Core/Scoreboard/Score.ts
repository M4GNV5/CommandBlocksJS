/// <reference path="../API.ts"/>

module Scoreboard
{
	export class Score implements Runtime.Number
	{
		private objective: Scoreboard.Objective;
		private selector: Entities.Selector;
		private name: string;

		get Selector(): Entities.Selector
		{
			return this.selector;
		}

		constructor(objective: Scoreboard.Objective, selector: Entities.Selector, startValue: number = 0, intialize: boolean = true)
		{
			this.selector = selector;
			this.objective = objective;
			this.name = Util.Naming.next("score");

			if (intialize)
				this.set(startValue);
		}

		set(value: number, mode?: Runtime.NumberSetMode): void;
		set(value: Runtime.Number, mode?: Runtime.NumberSetMode): void;
		set(value: any, mode: Runtime.NumberSetMode = Runtime.NumberSetMode.assign): void
		{
			if (typeof value == 'number' && mode == Runtime.NumberSetMode.assign)
				this.objective.set(this.selector, value);
			else if (mode == Runtime.NumberSetMode.assign)
				this.operation("=", value);
			else if (mode == Runtime.NumberSetMode.divisionRemainder)
				this.operation("%=", value);
			else if (mode == Runtime.NumberSetMode.smallerOne)
				this.operation("<", value);
			else if (mode == Runtime.NumberSetMode.biggerOne)
				this.operation(">", value);
		}

		add(value: number): void;
		add(value: Runtime.Number): void;
		add(value: any): void
		{
			if (typeof value == 'number')
				this.objective.add(this.selector, value);
			else
				this.operation("+=", <Runtime.Number>value);
		}

		remove(value: number): void;
		remove(value: Runtime.Number): void;
		remove(value: any): void
		{
			if (typeof value == 'number')
				this.objective.remove(this.selector, value);
			else
				this.operation("-=", <Runtime.Number>value);
		}

		multiplicate(value: number): void;
		multiplicate(value: Runtime.Number): void;
		multiplicate(value: any): void
		{
			this.operation("*=", value);
		}

		divide(value: number): void;
		divide(value: Runtime.Number): void;
		divide(value: any): void
		{
			this.operation("/=", value);
		}

		swap(other: Runtime.Number): void
		{
			this.operation("><", other);
		}

		reset(): void
		{
			this.objective.reset(this.selector);
		}

		clone(cloneName?: string): Runtime.Integer
		{
			var clone = new Runtime.Integer(0, cloneName, false);
			clone.set(this);
			return clone;
		}

		operation(operation: string, other: number)
		operation(operation: string, other: Runtime.Number)
		operation(operation: string, other: any)
		{
			var _other: Runtime.Integer;
			if (typeof other == 'number')
				_other = new Runtime.Integer(<number>other, "const" + other);
			else
				_other = (<Runtime.Number>other).toInteger();

			this.objective.operation(this.selector, this.objective, _other.Selector, operation);
		}

		isExact(value: number, callback?: Function): MinecraftCommand
		{
			return this.isBetween(value, value, callback);
		}

		isBetween(min: number = -2147483648, max: number = 2147483647, callback?: Function): MinecraftCommand
		{
			var cmd = this.objective.test(this.selector, min, max);

			if (typeof callback == 'function')
				cmd.validate(callback);

			return cmd;
		}

		toInteger(): Runtime.Integer
		{
			return this.clone(this.name);
		}

		toTellrawExtra(): Chat.TellrawScoreExtra
		{
			return new Chat.TellrawScoreExtra(this.objective, this.selector);
		}
	}
}
 
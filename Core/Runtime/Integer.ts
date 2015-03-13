/// <reference path="../API.ts"/>

module Runtime
{
	export class Integer implements Number
	{
		public static get MaxValue()
		{
			return new Integer(-2147483647);
		}
		public static get MinValue()
		{
			return new Integer(2147483647);
		}

		static score: Scoreboard.Objective;

		private selector: Entities.Selector;

		get Selector(): Entities.Selector
		{
			return this.selector;
		}

		constructor(value?: number, name?: string, intialize?: boolean)
		constructor(value?: number, selector?: Entities.Selector, intialize?: boolean)
		constructor(value: number = 0, selector: any = Util.Naming.next("int"), intialize: boolean = true)
		{
			if (selector instanceof Entities.Selector)
				this.selector = selector;
			else
				this.selector = new Entities.Player(selector.toString());

			this.set(value);
		}

		set(value: number, mode?: NumberSetMode): void;
		set(value: Number, mode?: NumberSetMode): void;
		set(value: any, mode: NumberSetMode = NumberSetMode.assign): void
		{
			if (typeof value == 'number' && mode == NumberSetMode.assign)
				Integer.score.set(this.selector, value);
			else if (mode == NumberSetMode.assign)
				this.operation("=", value);
			else if (mode == NumberSetMode.divisionRemainder)
				this.operation("%=", value);
			else if (mode == NumberSetMode.smallerOne)
				this.operation("<", value);
			else if (mode == NumberSetMode.biggerOne)
				this.operation(">", value);
		}

		add(value: number): void;
		add(value: Number): void;
		add(value: any): void
		{
			if (typeof value == 'number')
				Integer.score.add(this.selector, value);
			else
				this.operation("+=", <Number>value);
		}

		remove(value: number): void;
		remove(value: Number): void;
		remove(value: any): void
		{
			if (typeof value == 'number')
				Integer.score.remove(this.selector, value);
			else
				this.operation("-=", <Number>value);
		}

		multiplicate(value: number): void;
		multiplicate(value: Number): void;
		multiplicate(value: any): void
		{
			this.operation("*=", value);
		}

		divide(value: number): void;
		divide(value: Number): void;
		divide(value: any): void
		{
			this.operation("/=", value);
		}

		swap(other: Number): void
		{
			this.operation("><", other);
		}

		reset(): void
		{
			Integer.score.reset(this.selector);
		}

		clone(cloneName?: string): Integer
		{
			var clone = new Integer(0, cloneName, false);
			clone.set(this);
			return clone;
		}

		operation(operation: string, other: number)
		operation(operation: string, other: Number)
		operation(operation: string, other: any)
		{
			var _other: Integer;
			if (typeof other == 'number')
				_other = new Integer(<number>other, "const"+other);
			else
				_other = (<Number>other).toInteger();

			Integer.score.operation(this.selector, Integer.score, _other.Selector, operation);
		}

		isExact(value: number, callback?: Function): MinecraftCommand
		{
			return this.isBetween(value, value, callback);
		}

		isBetween(min: number = -2147483648, max: number = 2147483647, callback?: Function): MinecraftCommand
		{
			var cmd = Integer.score.test(this.selector, min, max);

			if (typeof callback == 'function')
				cmd.validate(callback);

			return cmd;
		}

		toInteger(): Integer
		{
			return this;
		}

		toTellrawExtra(): Chat.TellrawScoreExtra
		{
			return new Chat.TellrawScoreExtra(Integer.score, this.selector);
		}
	}
}

/// <reference path="../API.ts"/>

module Runtime
{
	export class Decimal implements Number
	{
		public static get Pi()
		{
			return new Decimal(3.14, Util.Naming.next("pi"));
		}
		public static get Euler()
		{
			return new Decimal(2.72, Util.Naming.next("euler"));
		}

		private static compileTimeAccuracy = 100;
		private static accuracy: Integer;

		private value: Integer;

		private name: string;

		constructor(startValue?: Integer, name?: string)
		constructor(startValue?: number, name?: string, intialize?: boolean)
		constructor(startValue: any = 0, name: string = Util.Naming.next("decimal"), intialize: boolean = true)
		{
			if (typeof Decimal.accuracy == 'undefined')
				Decimal.accuracy = new Integer(Decimal.compileTimeAccuracy, "decimalAccuracy");

			if (typeof startValue == 'number')
			{
				this.value = new Integer(startValue * Decimal.compileTimeAccuracy, name, intialize);
			}
			else
			{
				this.value = <Integer>startValue;
				this.value.multiplicate(Decimal.accuracy);
			}
			this.name = name;
		}

		set(value: number, mode?: NumberSetMode): void;
		set(value: Number, mode?: NumberSetMode): void;
		set(value: any, mode: NumberSetMode = NumberSetMode.assign): void
		{
			if (typeof value == 'number' && mode == NumberSetMode.assign)
				this.value.set(value * Decimal.compileTimeAccuracy);
			else if (mode == NumberSetMode.assign && value instanceof Decimal)
				this.operation("=", (<Decimal>value).value, false);
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
				this.value.add(value * Decimal.compileTimeAccuracy);
			else
				this.operation("+=", <Number>value);
		}

		remove(value: number): void;
		remove(value: Number): void;
		remove(value: any): void
		{
			if (typeof value == 'number')
				this.value.remove(value * Decimal.compileTimeAccuracy);
			else
				this.operation("-=", <Number>value);
		}

		multiplicate(value: number): void;
		multiplicate(value: Number): void;
		multiplicate(value: any): void
		{
			if (value instanceof Decimal)
			{
				this.operation("*=", (<Decimal>value).value, false);
				this.operation("/=", Decimal.accuracy, false);
			}
			else
				this.operation("*=", value);
		}

		divide(value: number): void;
		divide(value: Number): void;
		divide(value: any): void
		{
			if (value instanceof Decimal)
			{
				this.operation("*=", (<Decimal>value).value, false);
				this.operation("/=", Decimal.accuracy, false);
			}
			else
				this.operation("/=", value);
		}

		swap(other: Number): void
		{
			this.value.swap(other);
		}

		clone(cloneName?: string): Decimal
		{
			var copy = this.value.clone();
			return new Decimal(copy, cloneName);
		}

		operation(operation: string, other: number, convertToDecimal?: boolean)
		operation(operation: string, other: Number, convertToDecimal?: boolean)
		operation(operation: string, other: any, convertToDecimal: boolean = true)
		{
			var _other: Number;
			if (typeof other == 'number')
			{
				_other = new Integer(<number>other, "const" + other);
			}
			else
			{
				_other = (<Number>other).toInteger();

				if (convertToDecimal)
				{
					_other = _other.clone();
					_other.multiplicate(Decimal.accuracy);
				}
			}

			this.value.operation(operation, _other);
		}

		isExact(value: number, callback?: Function): MinecraftCommand
		{
			return this.isBetween(value, value, callback);
		}

		isBetween(min: number = -21474836.48, max: number = 21474836.47, callback?: Function): MinecraftCommand
		{
			min *= Decimal.compileTimeAccuracy;
			if (typeof max != 'undefined')
				max *= Decimal.compileTimeAccuracy;

			return this.value.isBetween(min, max, callback);
		}

		toInteger(): Integer
		{
			var out = new Integer(0, this.name + "O", false);
			out.set(this.value);
			out.divide(Decimal.accuracy);
			return out;
		}

		toTellrawExtra(): Chat.TellrawScoreExtra
		{
			return this.toInteger().toTellrawExtra();
		}
		toExactTellrawExtra(): Chat.Message[]
		{
			var cp = this.value.clone(this.name + "O2");
			cp.set(Decimal.accuracy, NumberSetMode.divisionRemainder);

			var messages = [];
			messages[0] = this.toTellrawExtra();
			messages[1] = new Chat.Message(".");
			messages[2] = cp.toTellrawExtra();

			return messages;
		}
	}
}

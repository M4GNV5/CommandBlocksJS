/// <reference path="../API.ts"/>

module Runtime
{
	export class Decimal implements Number
	{
		static accuracy = 10000;

		private value: Integer;

		private name: string;

		constructor(startValue?: Integer, name?: string)
		constructor(startValue?: number, name?: string, intialize?: boolean)
		constructor(startValue: any = 0, name: string = Util.Naming.next("decimal"), intialize: boolean = true)
		{
			if (typeof startValue == 'number')
				this.value = new Integer(startValue, name, intialize);
			else
				this.value = <Integer>startValue;
			this.name = name;
		}

		set(value: number, mode?: NumberSetMode): void;
		set(value: Number, mode?: NumberSetMode): void;
		set(value: any, mode: NumberSetMode = NumberSetMode.assign): void
		{
			if (typeof value == 'number' && mode == NumberSetMode.assign)
				this.value.set(value * Decimal.accuracy);
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
				this.value.add(value * Decimal.accuracy);
			else
				this.operation("+=", <Number>value);
		}

		remove(value: number): void;
		remove(value: Number): void;
		remove(value: any): void
		{
			if (typeof value == 'number')
				this.value.remove(value * Decimal.accuracy);
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
			this.value.swap(other);
		}

		clone(cloneName?: string): Decimal
		{
			var copy = this.value.clone();
			return new Decimal(copy, cloneName);
		}

		operation(operation: string, other: number)
		operation(operation: string, other: Number)
		operation(operation: string, other: any)
		{
			var _other: Integer;
			if (typeof other == 'number')
			{
				var val = other * Decimal.accuracy;
				_other = new Integer(val, "const" + val);
			}
			else
			{
				_other = (<Number>other).toInteger();
				_other.multiplicate(Decimal.accuracy);
			}

			this.value.operation(operation, _other);
		}

		isExact(value: number, callback?: Function): MinecraftCommand
		{
			return this.isBetween(value, value, callback);
		}

		isBetween(min: number = 0, max?: number, callback?: Function): MinecraftCommand
		{
			min *= Decimal.accuracy;
			if (typeof max != 'undefined')
				max *= Decimal.accuracy;

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
	}
}

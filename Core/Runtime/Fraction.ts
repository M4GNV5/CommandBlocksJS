/// <reference path="../API.ts"/>

module Runtime
{
	export class Fraction implements Number
	{
		numerator: Number;
		denominator: Number;

		name: string;

		private get copyName()
		{
			return this.name + "C";
		}

		constructor(numerator: Number = new Integer(0), denominator: Number = new Integer(1), name: string = Util.Naming.next("fraction"))
		{
			this.numerator = numerator;
			this.denominator = denominator;

			this.name = name;
		}

		set(value: number, mode?: NumberSetMode): void;
		set(value: Number, mode?: NumberSetMode): void;
		set(value: any, mode: NumberSetMode = NumberSetMode.assign): void
		{
			if (value instanceof Fraction && mode == NumberSetMode.assign)
			{
				var frac = <Fraction>value;
				this.numerator.set(frac.numerator);
				this.denominator.set(frac.denominator);
			}
			else
			{
				this.numerator.set(value, mode);
				this.denominator.set(1);
			}
		}

		add(value: number, reduceToLowest?: boolean): void;
		add(value: Number, reduceToLowest?: boolean): void;
		add(value: any, reduceToLowest: boolean = true): void
		{
			if (value instanceof Fraction)
			{
				var copy = (<Fraction>value).clone(this.copyName);
				copy.numerator.multiplicate(this.denominator);
				this.numerator.multiplicate(copy.denominator);
				this.numerator.add(copy.numerator);
			}
			else
			{
				var numCopy: Number = value.clone(this.copyName);
				numCopy.multiplicate(this.denominator);
				this.numerator.add(numCopy);
			}

			if (reduceToLowest)
				this.reduceToLowest();
		}

		remove(value: number, reduceToLowest?: boolean): void;
		remove(value: Number, reduceToLowest?: boolean): void;
		remove(value: any, reduceToLowest: boolean = true): void
		{
			if (value instanceof Fraction)
			{
				var copy = (<Fraction>value).clone(this.copyName);
				copy.numerator.multiplicate(this.denominator);
				this.numerator.multiplicate(copy.denominator);
				this.numerator.remove(copy.numerator);
			}
			else
			{
				var numCopy: Number = value.clone(this.copyName);
				numCopy.multiplicate(this.denominator);
				this.numerator.remove(numCopy);
			}

			if (reduceToLowest)
				this.reduceToLowest();
		}

		multiplicate(value: number): void;
		multiplicate(value: Number): void;
		multiplicate(value: any): void
		{
			if (value instanceof Fraction)
			{
				var val = <Fraction>value;
				this.numerator.multiplicate(val.numerator);
				this.denominator.multiplicate(val.denominator);
			}
			else
			{
				this.numerator.multiplicate(value);
			}
		}

		divide(value: number): void;
		divide(value: Number): void;
		divide(value: any): void
		{
			if (value instanceof Fraction)
			{
				var val = <Fraction>value;
				this.denominator.multiplicate(val.numerator);
				this.numerator.multiplicate(val.denominator);
			}
			else
			{
				this.denominator.multiplicate(value);
			}
		}

		swap(other: Number): void
		{
			var copy = other.clone(this.copyName);
			other.set(this);
			this.set(copy);
		}

		clone(cloneName?: string): Fraction
		{
			return new Fraction(this.numerator.clone(), this.denominator.clone(), cloneName);
		}

		reduceToLowest(accuracy: number = 2): void
		{
			accuracy = Math.pow(10, accuracy);
			this.numerator.multiplicate(accuracy);
			this.numerator.divide(this.denominator);
			this.denominator.set(accuracy);
		}

		isExact(value: number, callback?: Function): MinecraftCommand
		{
			return this.isBetween(value, value, callback);
		}

		isBetween(min: number = 0, max?: number, callback?: Function): MinecraftCommand
		{
			return this.toInteger().isBetween(min, max, callback);
		}

		toInteger(): Integer
		{
			var out = new Integer(0, this.name, false);
			out.set(this.numerator);
			out.divide(this.denominator);
			return out;
		}

		toTellrawExtra(): Chat.TellrawScoreExtra
		{
			return this.toInteger().toTellrawExtra();
		}
		toExactTellrawExtra(): Chat.Message[]
		{
			var messages = [];
			messages[0] = this.numerator.toTellrawExtra();
			messages[1] = new Chat.Message("/");
			messages[2] = this.denominator.toTellrawExtra();

			return messages;
		}
	}
}

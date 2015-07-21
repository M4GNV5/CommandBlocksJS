/// <reference path="./../API.ts"/>

var jsMath = Math;

module Util
{
	export class Math
	{
		private static knownCallbacks = [];

		static pow(base: Runtime.Number, exponent: Runtime.Number, result: Runtime.Number, callback?: Function): void
		{
			result.set(1);
			var _exponent = exponent.clone(Util.Naming.next("mathPow"));
			var repeat = function ()
			{
				result.multiplicate(base);

				_exponent.remove(1);

				_exponent.isBetween(undefined, 0).validate(callback, repeat);
			};
			_exponent.isBetween(undefined, 0).validate(callback, repeat);
		}

		static sqrt(value: Runtime.Number, result: Runtime.Number, callback?: Function): void
		{
			var step = new Runtime.Integer(32768, Util.Naming.next("mathSqrt0-"));
			result.set(step);

			var repeat = function ()
			{
				var square = new Runtime.Integer(1, Util.Naming.next("mathSqrt1-"));

				square.multiplicate(result);
				square.multiplicate(result);

				square.remove(value);

				step.divide(2);

				var _repeat = function ()
				{
					step.isExact(0).validate(callback, repeat);
				}

				square.isBetween(undefined, -1, function ()
				{
					result.add(step);
					call(_repeat);
				});
				square.isBetween(1, undefined, function ()
				{
					result.remove(step);
					call(_repeat);
				});
			}
			call(repeat, true);
		}

		static sin(value: Runtime.Number, result: Runtime.Number, callback?: Function): void
		{
			// http://upload.wikimedia.org/math/a/3/b/a3b692cd234b734e121ef24621f3635b.png

			call(function ()
			{
				result.set(value);
				var numerator = new Runtime.Decimal(0, Util.Naming.next("mathSin0-"));
				var fraction = new Runtime.Decimal(0, Util.Naming.next("mathSin1-"));

				numerator.set(value);

				numerator.multiplicate(value);
				numerator.multiplicate(value);
				fraction.set(numerator);
				fraction.divide(6); //3!
				result.remove(fraction);

				numerator.multiplicate(value);
				numerator.multiplicate(value)
				fraction.set(numerator);
				fraction.divide(120); //5!
				result.add(fraction);

				numerator.multiplicate(value);
				numerator.multiplicate(value);
				fraction.set(numerator);
				fraction.divide(5040); //7!
				result.remove(fraction);

				numerator.multiplicate(value);
				numerator.multiplicate(value);
				fraction.set(numerator);
				fraction.divide(362880); //9!
				result.add(fraction);

				call(callback);
			});
		}

		static factorial(value: Runtime.Number, result: Runtime.Number, callback?: Function): void
		{
			var current = value.clone(Util.Naming.next("mathFactorial"));
			result.set(1);
			var repeat = function ()
			{
				result.multiplicate(current);
				current.remove(1);

				current.isBetween(undefined, 0).validate(callback, repeat);
			};
			current.isBetween(undefined, 0).validate(callback, repeat);
		}
	}
}

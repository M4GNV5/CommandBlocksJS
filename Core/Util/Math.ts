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
			call(repeat);
		}

		static sin(value: Runtime.Number, result: Runtime.Number, callback?: Function): void
		{
			// http://upload.wikimedia.org/math/a/3/b/a3b692cd234b734e121ef24621f3635b.png

			result.set(0);
			var exponent = new Runtime.Integer(1, Util.Naming.next("mathSin0-"));
			var factorialPos = new Runtime.Integer(1, Util.Naming.next("mathSin1-"));
			var factorial = new Runtime.Integer(1, Util.Naming.next("mathSin2-"));
			var isNegative = new Runtime.Integer(1, Util.Naming.next("mathSin3-"));

			var repeat = function ()
			{
				var _result = new Runtime.Decimal(0, Util.Naming.next("mathSin4-"));
				Math.pow(value, exponent, _result, function ()
				{
					_result.divide(factorial);
					_result.multiplicate(isNegative);

					result.add(_result);

					isNegative.multiplicate(-1);

					factorialPos.add(1);
					factorial.multiplicate(factorialPos);
					factorialPos.add(1);
					factorial.multiplicate(factorialPos);

					exponent.add(2);

					factorialPos.isBetween(11).validate(callback, repeat);
				});
			}
			call(repeat);
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

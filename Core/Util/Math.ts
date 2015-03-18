/// <reference path="./../API.ts"/>

var jsMath = Math;

module Util
{
	export class Math
	{
		private static knownCallbacks = [];

		static pow(base: Runtime.Number, exponent: Runtime.Number, callback: (value: Runtime.Number) => void): void
		{
			if (this.knownCallbacks.indexOf(callback) == -1)
				this.knownCallbacks.push(callback);
			var id = this.knownCallbacks.indexOf(callback);

			var value = new Runtime.Integer(0, "mathResult" + id);

			value.set(base);
			var _exponent = new Runtime.Integer(0, "mathResult" + id + "E");
			_exponent.set(exponent);

			var repeat = function ()
			{
				value.multiplicate(base);
				_exponent.remove(1);

				_exponent.isBetween(undefined, 1).validate(function () { callback(value); }, repeat);
			};
			call(repeat);
		}
	}
}

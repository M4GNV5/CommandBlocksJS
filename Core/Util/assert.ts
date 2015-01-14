/// <reference path="./../API.ts"/>

module Util
{
	export function assert(condition: boolean, message = "Assertion failed"): void
	{
		if (!condition)
			throw message;
	}
}

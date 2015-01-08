//#test.ts
/// <reference path="ref.ts"/>

function assert(condition: boolean, message = "Assertion failed"): void
{
	if (!condition)
		throw message;
}

function isSelector(c)
{
	assert(c == "a" || c == "e" || c == "r" || c == "p");
	return c;
}

assert(true, "Assert is not working");
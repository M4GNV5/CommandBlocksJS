function assert(condition, message) {
	if (!condition) {
		throw message || "Assertion failed";
	}
}

function expect(actual, fallback, type)
{
	if(typeof type !== "undefined")
		assert(typeof actual === type);
	if(typeof actual === "undefined")
		return fallback;
	return actual;
}

function assert(condition, message) {
    if (message === void 0) { message = "Assertion failed"; }
    if (!condition)
        throw message;
}
function isSelector(c) {
    assert(c == "a" || c == "e" || c == "r" || c == "p");
    return c;
}
assert(true, "Assert is not working");

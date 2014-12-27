function assert(condition, message) {
    if (typeof message === "undefined") { message = "Assertion failed"; }
    if (!condition)
        throw message;
}

function isSelector(c) {
    assert(c == "a" || c == "e" || c == "r" || c == "p");
    return c;
}

assert(true, "Assert is not working");

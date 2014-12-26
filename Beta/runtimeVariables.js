var RuntimeInteger = (function () {
    function RuntimeInteger(options) {
        options = options || {};
        this.name = options.name || Naming.next("int");
        options.startValue = options.startValue || 0;
        RuntimeInteger.score.set(this.name, options.startValue);
    }
    RuntimeInteger.prototype.set = function (value) {
        RuntimeInteger.score.set(this.name, value);
    };
    RuntimeInteger.prototype.add = function (value) {
        RuntimeInteger.score.add(this.name, value);
    };
    RuntimeInteger.prototype.remove = function (value) {
        RuntimeInteger.score.remove(this.name, value);
    };
    RuntimeInteger.prototype.reset = function () {
        RuntimeInteger.score.reset(this.name);
    };
    RuntimeInteger.prototype.test = function (callback, min, max) {
        RuntimeInteger.score.test(this.name, callback, min, max);
    };
    RuntimeInteger.prototype.operation = function (operation, other, otherPlayer) {
        RuntimeInteger.score.operation(this.name, operation, otherPlayer, other);
    };
    RuntimeInteger.prototype.isExact = function (value, callback) {
        return this.hasValue(value, callback);
    };
    RuntimeInteger.prototype.hasValue = function (value, callback) {
        return this.isBetween(value, value, callback);
    };
    RuntimeInteger.prototype.isBetween = function (min, max, callback) {
        if (max === void 0) { max = min; }
        var command = "scoreboard players test " + this.name + " " + RuntimeInteger.score.name + " " + min + " " + max;
        if (callback !== undefined)
            validate(command, callback);
        return command;
    };
    RuntimeInteger.prototype.asTellrawExtra = function () {
        var extra = new TellrawExtra();
        extra.obj = {
            score: {
                name: this.name,
                objective: RuntimeInteger.score.name
            }
        };
        return extra;
    };
    RuntimeInteger.score = new Score("std.values", "dummy");
    return RuntimeInteger;
})();
var RuntimeBoolean = (function () {
    function RuntimeBoolean() {
        this.base = new RuntimeInteger();
    }
    RuntimeBoolean.prototype.set = function (value) {
        if (value)
            this.base.set(1);
        else
            this.base.set(0);
    };
    RuntimeBoolean.prototype.hasValue = function (value, callback) {
        if (value)
            return this.base.hasValue(1, callback);
        else
            return this.base.hasValue(0, callback);
    };
    RuntimeBoolean.prototype.isTrue = function (callback) {
        return this.hasValue(true, callback);
    };
    RuntimeBoolean.prototype.isFalse = function (callback) {
        return this.hasValue(false, callback);
    };
    RuntimeBoolean.prototype.asTellrawExtra = function () {
        return this.base.asTellrawExtra();
    };
    return RuntimeBoolean;
})();
var RuntimeString = (function () {
    function RuntimeString(value) {
        if (value === void 0) { value = Naming.next("string"); }
        RuntimeString.lastIndex++;
        this.selector = Selector.parse("@e[score_strings_min=" + RuntimeString.lastIndex + ",score_strings=" + RuntimeString.lastIndex + "]");
        callOnce(function () {
            command('summon Chicken ~ ~1 ~ {CustomName:"' + value + '",NoAI:true,Invincible:true}');
            RuntimeString.indexScore.set('@e[name=' + value + ']', RuntimeString.lastIndex);
        });
        delay(4);
    }
    RuntimeString.prototype.set = function (value) {
        command('entitydata ' + this.selector + ' {CustomName:"' + value + '"}');
    };
    RuntimeString.prototype.hasValue = function (value, callback) {
        var hasValueSelector = this.selector.clone();
        hasValueSelector.setAttribute("name", value);
        testfor(hasValueSelector.toString(), callback);
        return hasValueSelector;
    };
    RuntimeString.prototype.asTellrawExtra = function () {
        var extra = new TellrawExtra();
        extra.obj = {
            selector: this.selector.toString()
        };
        return extra;
    };
    RuntimeString.lastIndex = 0;
    RuntimeString.indexScore = new Score("std.strings", "dummy");
    return RuntimeString;
})();

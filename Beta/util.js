//region utility functions
function callOnce(callback, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
    call(function () {
        command("setblock ~-3 ~ ~ minecraft:air 0 replace", true);
        callback();
    }, placeRepeater);
}
function validate(cmd, callback, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
    if (placeRepeater !== false)
        delay();
    sidewards(function () {
        queryCommand(cmd, false);
        comparator();
        call(callback, false);
    });
}
function validateSync(cmd, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
    queryCommand(cmd, placeRepeater);
    comparator();
}
function testfor(statement, callback, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
    validate('testfor ' + statement, callback, placeRepeater);
}
function testforSync(statement, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
    validateSync('testfor ' + statement, placeRepeater);
}
function testforNot(statement, callback, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
    if (placeRepeater)
        delay();
    sidewards(function () {
        queryCommand("testfor " + statement, false);
        comparator();
        block(1);
    });
    delay();
    sidewards(function () {
        command("setblock ~-1 ~ ~2 minecraft:unpowered_repeater 1", false);
        delay();
        delay();
        call(callback, false);
    });
}
//endregion
//region timer
function timer(time, callback) {
    var t = new Timer(callback, { time: time });
    t.start();
    return t;
}
var Timer = (function () {
    function Timer(callback, options) {
        if (options === void 0) { options = { time: 10, useScoreboard: false, hardTickLength: 10, callAsync: false, scoreName: Naming.next("timer") }; }
        this.options = options;
        this.callback = callback;
        if (options.useScoreboard !== false) {
            this.scoreTicks = ((options.time / options.hardTickLength) < 1) ? 1 : (options.time / options.hardTickLength);
            options.time = options.hardTickLength;
            var varOptions = {};
            varOptions.name = options.scoreName;
            this.timerVar = new RuntimeInteger(varOptions);
            var isRunningOptions = {};
            isRunningOptions.name = varOptions.name + "R";
            this.isRunning = new RuntimeInteger(isRunningOptions);
            this.isRunning.set(-1);
            callOnce(function () {
                this.timerVar.set(-1);
            });
            delay(3);
            options.time = (options.time - 5 > 0) ? options.time - 5 : 1;
        }
    }
    Timer.prototype.timerFunc = function () {
        if (this.options.useScoreboard == false) {
            if (this.options.callAsync)
                call(this.callback);
            else
                this.callback();
        }
        else {
            testforSync(this.isRunning.hasValue(1));
            this.timerVar.add(1);
            testfor(this.timerVar.isBetween(this.scoreTicks), function () {
                this.timerVar.set(0);
                this.callback();
            });
        }
        delay(this.options.time);
        call(this.timerFunc);
    };
    Timer.prototype.start = function () {
        if (this.options.useScoreboard) {
            testfor(this.isRunning.hasValue(-1), this.timerFunc);
            this.isRunning.set(1);
        }
        else {
            call(this.timerFunc);
        }
    };
    Timer.prototype.stop = function () {
        if (this.options.useScoreboard == false)
            throw "Cannot stop timer that doesnt use the Scoreboard";
        this.isRunning.set(-1);
    };
    return Timer;
})();

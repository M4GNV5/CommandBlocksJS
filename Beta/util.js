//region utility functions
function callOnce(callback, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    call(function () {
        command("setblock ~-3 ~ ~ minecraft:air 0 replace", true);
        callback();
    }, placeRepeater);
}

function validate(cmd, callback, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    if (placeRepeater !== false)
        delay();

    sidewards(function () {
        queryCommand(cmd, false);
        comparator();
        call(callback, false);
    });
}

function validateSync(cmd, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    queryCommand(cmd, placeRepeater);
    comparator();
}

function testfor(statement, callback, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    validate('testfor ' + statement, callback, placeRepeater);
}

function testforSync(statement, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    validateSync('testfor ' + statement, placeRepeater);
}

function testforNot(statement, callback, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
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
        if (typeof options === "undefined") { options = { time: 10, useScoreboard: false, hardTickLength: 10, callAsync: false, scoreName: Naming.next("timer") }; }
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

            var _timerVar = this.timerVar;
            callOnce(function () {
                _timerVar.set(-1);
            });
            delay(3);

            options.time = (options.time - 5 > 0) ? options.time - 5 : 1;
        }
    }
    Timer.prototype.timerFunc = function (self) {
        if (self.options.useScoreboard === false) {
            if (self.options.callAsync)
                call(self.callback);
            else
                self.callback();
        } else {
            testforSync(self.isRunning.hasValue(1));
            self.timerVar.add(1);
            testfor(self.timerVar.isBetween(self.scoreTicks), function () {
                self.timerVar.set(0);
                self.callback();
            });
        }

        delay(self.options.time);
        call(arguments.callee.caller);
    };

    Timer.prototype.start = function () {
        if (this.options.useScoreboard) {
            testfor(this.isRunning.hasValue(-1), this.timerFunc);
            this.isRunning.set(1);
        } else {
            var that = this;
            call(function () {
                that.timerFunc(that);
            });
        }
    };

    Timer.prototype.stop = function () {
        if (this.options.useScoreboard == false)
            throw "Cannot stop timer that doesnt use the Scoreboard";
        this.isRunning.set(-1);
    };
    return Timer;
})();
//endregion

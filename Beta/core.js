//region core classes
var OutputHandler = (function () {
    function OutputHandler() {
        this.output = [''];
        this.functions = [function () {
        }];
        this.current = 0;
    }
    OutputHandler.prototype.addFunction = function (func) {
        if (this.functions.indexOf(func) == -1) {
            this.functions.push(func);
            var id = this.functions.indexOf(func);
            this.output[id] = '';
            var last = this.current;
            this.current = id;
            wire(2);
            command("setblock ~-3 ~ ~ minecraft:air 0 replace");
            func();
            this.current = last;
            return id;
        }
        return this.functions.indexOf(func);
    };
    OutputHandler.prototype.removeFunction = function (func) {
        var id = this.functions.indexOf(func);
        if (id == -1)
            return;
        if (id == this.current)
            throw "Cant remove current Function!";
        this.functions.splice(id, 1);
        this.output.splice(id, 1);
    };
    OutputHandler.prototype.addToCurrent = function (code) {
        this.output[this.current] += code;
    };
    return OutputHandler;
})();
var outputHandler = new OutputHandler();
//endregion
//region core functions
var direction = 1;
function block(id, data) {
    if (id === void 0) { id = 1; }
    if (data === void 0) { data = 0; }
    id = id || 1;
    data = data || 0;
    outputHandler.addToCurrent('b' + id + '_' + data + ';');
}
function command(text, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = false; }
    if (placeRepeater)
        delay();
    outputHandler.addToCurrent('c' + text + ';');
}
function queryCommand(text, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = false; }
    if (placeRepeater)
        delay();
    outputHandler.addToCurrent('q' + text + ';');
}
function sidewards(func) {
    direction++;
    var code = 's';
    var oldManager = outputHandler;
    var newManager = new function () {
        this.addToCurrent = function (data) {
            code += data.replace(/;/g, '|');
        };
        this.addFunction = function (func) {
            direction--;
            outputHandler = oldManager;
            var id = outputHandler.addFunction(func);
            outputHandler = newManager;
            direction++;
            return id;
        };
    };
    outputHandler = newManager;
    func();
    outputHandler = oldManager;
    outputHandler.addToCurrent(code + ';');
    direction--;
}
function call(func, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = false; }
    var funcId = outputHandler.addFunction(func);
    if (placeRepeater)
        delay();
    outputHandler.addToCurrent('e' + funcId + ';');
}
function sign(text1, text2, text3, text4, direc) {
    if (text1 === void 0) { text1 = ""; }
    if (text2 === void 0) { text2 = ""; }
    if (text3 === void 0) { text3 = ""; }
    if (text4 === void 0) { text4 = ""; }
    if (direc === void 0) { direc = direction * 4; }
    outputHandler.addToCurrent('n' + text1 + text2 + text3 + text4 + '_' + direc + ';');
}
//enregion
//region wrapper functions
function wire(length) {
    if (length === void 0) { length = 1; }
    for (var i = 0; i < length; i++)
        block(55);
}
function torch(activated) {
    if (activated === void 0) { activated = true; }
    var data = (direction == 4) ? direction + 1 : 1;
    if (activated)
        block(76, data);
    else
        block(75, data);
}
function delay(time) {
    if (time === void 0) { time = 0; }
    while (time >= 0) {
        var delay = (time > 3) ? 3 : (time == 0) ? 0 : time - 1;
        var data = delay * 4 + direction;
        block(93, data);
        time -= (time > 3) ? delay + 1 : delay + 2;
    }
}
function comparator(activated) {
    if (activated === void 0) { activated = false; }
    if (activated)
        block(150, direction);
    else
        block(149, direction);
}
function invert(blockId, placeRepeater) {
    if (blockId === void 0) { blockId = 1; }
    if (placeRepeater === void 0) { placeRepeater = false; }
    if (placeRepeater)
        delay();
    block(blockId);
    torch();
}
//endregion
//region main code
block(143, 5);
wire(1);
function cbjsWorker() {
    OutputParser.start();
    api.log("Successfully executed " + outputHandler.functions.length + " functions!");
}
//endregion
//region internal helper classes
var Naming = (function () {
    function Naming() {
    }
    Naming.next = function (name) {
        this.names[name] = this.names[name] || 0;
        this.names[name]++;
        return name + this.names[name];
    };
    Naming.names = {};
    return Naming;
})();
var Vector3 = (function () {
    function Vector3(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3.prototype.toString = function (splitter) {
        if (splitter === void 0) { splitter = ' '; }
        return this.x + splitter + this.y + splitter + this.z;
    };
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    return Vector3;
})();
var OutputParser = (function () {
    function OutputParser() {
    }
    OutputParser.start = function () {
        this.position = startPosition;
        var functions = outputHandler.output;
        for (var i = 0; i < functions.length; i++) {
            this.functionPositions[i] = this.position.clone();
            var sidewards = this.getMaxSidewards(functions[i]);
            this.updatePosition(function () {
                this.position.z -= sidewards;
            }, function () {
                this.position.z += sidewards;
            }, function () {
                this.position.z -= sidewards;
            }, function () {
                this.position.z += sidewards;
            });
        }
        for (var i = 0; i < functions.length; i++) {
            var source = functions[i];
            this.position = this.functionPositions[i].clone();
            this.parseFunction(source);
        }
        api.save();
    };
    OutputParser.getMaxSidewards = function (source) {
        var sidewards = 2;
        var splitted = source.split(';');
        for (var i = 0; i < splitted.length; i++) {
            var splittedCall = splitted[i].split('|');
            if (splittedCall.length > sidewards) {
                sidewards = splittedCall.length;
            }
        }
        return sidewards;
    };
    OutputParser.parseFunction = function (source) {
        if (source == '')
            return;
        var calls = source.split(';');
        for (var i = 0; i < calls.length; i++) {
            var _call = calls[i].trim();
            if (_call == '')
                continue;
            this.parseCall(_call);
            this.updatePosition(function () {
                this.position.x--;
            }, function () {
                this.position.x++;
            }, function () {
                this.position.z--;
            }, function () {
                this.position.z++;
            });
        }
    };
    OutputParser.parseCall = function (source) {
        if (source.length < 1)
            return;
        switch (source[0]) {
            case 'c':
                var command = source.substring(1);
                api.placeCommandBlock(command, this.position.x, this.position.y, this.position.z);
                break;
            case 'q':
                var qCommand = source.substring(1);
                api.placeCommandBlock(qCommand, this.position.x, this.position.y, this.position.z);
                var torchPos = new Vector3(this.position.x, this.position.y + 1, this.position.z);
                api.placeBlock(75, 5, torchPos.x, torchPos.y, torchPos.z);
                var resetCbPos = new Vector3(this.position.x, this.position.y + 2, this.position.z);
                var escapedCommand = qCommand.replace("\"", "\\\"");
                var resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".replace("%cmd%", escapedCommand);
                api.placeCommandBlock(resetCommand, resetCbPos.x, resetCbPos.y, resetCbPos.z);
                break;
            case 'b':
                var blockInfo = source.substring(1).split('_');
                api.placeBlock(blockInfo[0], blockInfo[1], this.position.x, this.position.y, this.position.z);
                break;
            case 's':
                var calls = source.substring(1).split('|');
                var oldPos = this.position.clone();
                direction++;
                for (var i = 0; i < calls.length; i++) {
                    this.parseCall(calls[i].trim());
                    this.updatePosition(function () {
                        this.position.x--;
                    }, function () {
                        this.position.x++;
                    }, function () {
                        this.position.z--;
                    }, function () {
                        this.position.z++;
                    });
                }
                direction--;
                this.position = oldPos;
                break;
            case 'e':
                var ePosition = this.functionPositions[source.substring(1)];
                var offX = ePosition.x - this.position.x;
                var offY = ePosition.y - this.position.y;
                var offZ = ePosition.z - this.position.z;
                var eCommand = "setblock ~" + offX + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace";
                api.placeCommandBlock(eCommand, this.position.x, this.position.y, this.position.z);
                break;
            case 'n':
                var lines = source.substring(1).split('_');
                var signDirection = lines[lines.length - 1];
                lines[lines.length - 1] = '';
                api.placeSign(lines, signDirection, this.position.x, this.position.y, this.position.z);
                break;
            default:
                api.log("Unknown Source: '" + source + "'");
                break;
        }
    };
    OutputParser.updatePosition = function (xMinus, xPlus, zMinus, zPlus) {
        switch (direction) {
            case 0:
                zMinus();
                break;
            case 1:
                xPlus();
                break;
            case 2:
                zPlus();
                break;
            case 3:
                xMinus();
                break;
        }
    };
    OutputParser.direction = 1;
    OutputParser.functionPositions = {};
    return OutputParser;
})();
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

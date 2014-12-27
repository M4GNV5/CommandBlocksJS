
//region core classes
/**
* Class for managing functions.
*/
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

/**
* Static OutputHandler instance.
*/
var outputHandler = new OutputHandler();

//endregion
//region core functions
/**
* Initial direction.
*/
var direction = 1;

/**
* Places a block.
* @param id Minecraft ID of the block.
* @param data Block data/damage.
*/
function block(id, data) {
    if (typeof id === "undefined") { id = 1; }
    if (typeof data === "undefined") { data = 0; }
    outputHandler.addToCurrent('b' + id + '_' + data + ';');
}

/**
* Places a command block.
* @param text Content of the command block.
* @param placeRepeater Whether or not to place a repeater before calling the function.
*/
function command(text, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    if (placeRepeater)
        delay();
    outputHandler.addToCurrent('c' + text + ';');
}

/**
* Querys a command block.
* @param text Content of the command block.
* @param placeRepeater Whether or not to place a repeater before calling the function.
*/
function queryCommand(text, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    if (placeRepeater)
        delay();
    outputHandler.addToCurrent('q' + text + ';');
}

/**
* Places parallel code to the structure.
* @param func Function to add. Will be run immediately.
*/
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

/**
* Adds the function to the structure and calls the redstone.
* @param func JavaScript/TypeScript function.
* @param placeRepeater Whether or not to place a repeater before calling the function.
*/
function call(func, placeRepeater) {
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    var funcId = outputHandler.addFunction(func);
    if (placeRepeater)
        delay();
    outputHandler.addToCurrent('e' + funcId + ';');
}

/**
* Places a sign (for notes etc.)
* @param text1 First line of the sign.
* @param text2 Second line of the sign.
* @param text3 Third line of the sign.
* @param text4 Fourth line of the sign.
* @param direc Direction where the sign faces.
*/
function sign(text1, text2, text3, text4, direc) {
    if (typeof text1 === "undefined") { text1 = ""; }
    if (typeof text2 === "undefined") { text2 = ""; }
    if (typeof text3 === "undefined") { text3 = ""; }
    if (typeof text4 === "undefined") { text4 = ""; }
    if (typeof direc === "undefined") { direc = direction * 4; }
    outputHandler.addToCurrent('n' + text1 + text2 + text3 + text4 + '_' + direc + ';');
}

//enregion
//region wrapper functions
/**
* Places ´length´ redstone dust.
* @param length Length of the wire.
*/
function wire(length) {
    if (typeof length === "undefined") { length = 1; }
    for (var i = 0; i < length; i++)
        block(55);
}

/**
* Places a redstone torch.
* @param activated If false, the redstone torch will initially be turned off.
*/
function torch(activated) {
    if (typeof activated === "undefined") { activated = true; }
    var data = (direction == 4) ? direction + 1 : 1;
    if (activated)
        block(76, data);
    else
        block(75, data);
}

/**
* Places repeaters to delay ´time´. Will do nothing if ´time´ is zero.
* @param time Time in 1/10th of a second.
*/
function delay(time) {
    if (typeof time === "undefined") { time = 0; }
    while (time >= 0) {
        var delay = (time > 3) ? 3 : (time == 0) ? 0 : time - 1;
        var data = delay * 4 + direction;
        block(93, data);
        time -= (time > 3) ? delay + 1 : delay + 2;
    }
}

/**
* Places a comparator.
* @param activated If true, the comparator's state will initially be turned on.
*/
function comparator(activated) {
    if (typeof activated === "undefined") { activated = false; }
    if (activated)
        block(150, direction);
    else
        block(149, direction);
}

/**
* Inverts the signal. (NOT)
* @param blockId Block where redstone torch will be on.
* @param placeRepeater Whether or not to place a repeater before the block.
*/
function invert(blockId, placeRepeater) {
    if (typeof blockId === "undefined") { blockId = 1; }
    if (typeof placeRepeater === "undefined") { placeRepeater = true; }
    if (placeRepeater)
        delay();
    block(blockId);
    torch();
}

//endregion
//region main code
block(143, 5);
wire(1);

/**
* Entry point of every script. Will append automatically.
*/
function cbjsWorker() {
    OutputParser.start();

    EventHandler.emit("end");
    api.log("Successfully executed " + outputHandler.functions.length + " functions!");
}

//endregion
//region internal helper classes
/**
* Class for generating unique names. Useful for scoreboards.
*/
var Naming = (function () {
    function Naming() {
    }
    /**
    * Generates unique names with ´name´ as prefix. Will start at zero when giving a new name.
    * @param name Prefix for unique name.
    */
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
    Vector3.prototype.toString = function (separator) {
        if (typeof separator === "undefined") { separator = ' '; }
        return this.x + separator + this.y + separator + this.z;
    };

    Vector3.prototype.add = function (b) {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;

        return this;
    };

    Vector3.prototype.subtract = function (b) {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;

        return this;
    };

    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    return Vector3;
})();
//endredion

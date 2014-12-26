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
    if (id === void 0) { id = 1; }
    if (data === void 0) { data = 0; }
    outputHandler.addToCurrent('b' + id + '_' + data + ';');
}
/**
 * Places a command block.
 * @param text Content of the command block.
 * @param placeRepeater Whether or not to place a repeater before calling the function.
 */
function command(text, placeRepeater) {
    if (placeRepeater === void 0) { placeRepeater = true; }
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
    if (placeRepeater === void 0) { placeRepeater = true; }
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
    if (placeRepeater === void 0) { placeRepeater = true; }
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
    if (text1 === void 0) { text1 = ""; }
    if (text2 === void 0) { text2 = ""; }
    if (text3 === void 0) { text3 = ""; }
    if (text4 === void 0) { text4 = ""; }
    if (direc === void 0) { direc = direction * 4; }
    outputHandler.addToCurrent('n' + text1 + text2 + text3 + text4 + '_' + direc + ';');
}
//enregion
//region wrapper functions
/**
 * Places ´length´ redstone dust.
 * @param length Length of the wire.
 */
function wire(length) {
    if (length === void 0) { length = 1; }
    for (var i = 0; i < length; i++)
        block(55);
}
/**
 * Places a redstone torch.
 * @param activated If false, the redstone torch will initially be turned off.
 */
function torch(activated) {
    if (activated === void 0) { activated = true; }
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
    if (time === void 0) { time = 0; }
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
    if (activated === void 0) { activated = false; }
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
    if (blockId === void 0) { blockId = 1; }
    if (placeRepeater === void 0) { placeRepeater = true; }
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
        if (separator === void 0) { separator = ' '; }
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
/// <reference path="base.ts"/>
/// <reference path="tellraw.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameMode;
(function (GameMode) {
    GameMode[GameMode["Survival"] = 0] = "Survival";
    GameMode[GameMode["Creative"] = 1] = "Creative";
    GameMode[GameMode["Adventure"] = 2] = "Adventure";
    GameMode[GameMode["Spectator"] = 3] = "Spectator";
})(GameMode || (GameMode = {}));
//region player.js
var Player = (function () {
    function Player(selector) {
        if (selector instanceof String)
            this.selector = Selector.parse(selector);
        else if (selector instanceof Selector)
            this.selector = selector;
        else
            throw "Unsupported Selector type";
    }
    Player.prototype.setGameMode = function (mode) {
        command("gamemode " + mode.toString() + " " + this.selector);
    };
    Player.prototype.teleport = function (dest) {
        if (typeof dest == 'string') {
            command("tp " + this.selector + " " + dest);
        }
        else {
            if (typeof dest.yrot == 'undefined' || typeof dest.xrot != 'undefined')
                command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z);
            else
                command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z + " " + dest.yrot + " " + dest.xrot);
        }
    };
    Player.prototype.clear = function (item, data, maxCount, dataTag) {
        if (item === void 0) { item = ""; }
        if (data === void 0) { data = ""; }
        if (maxCount === void 0) { maxCount = ""; }
        if (dataTag === void 0) { dataTag = ""; }
        command("clear " + this.selector + " " + item + " " + data + " " + maxCount + " " + dataTag);
    };
    Player.prototype.tell = function (text) {
        command("tell " + this.selector + " " + text);
    };
    Player.prototype.tellraw = function (param) {
        if (typeof param == 'object') {
            param.tell(this.selector);
        }
        else {
            tellraw(this.selector, param);
        }
    };
    Player.prototype.setTeam = function (team) {
        if (typeof team == 'object') {
            team.join(this.selector);
        }
        else {
            command("scoreboard teams join " + team + " " + this.selector);
        }
    };
    Player.prototype.setScore = function (score, value) {
        if (typeof score == 'object') {
            score.set(this.selector, value);
        }
        else {
            command("scoreboard players set " + this.selector + " " + score + " " + value);
        }
    };
    Player.prototype.addScore = function (score, value) {
        if (typeof score == 'object') {
            score.add(this.selector, value);
        }
        else {
            command("scoreboard players add " + this.selector + " " + score + " " + value);
        }
    };
    Player.prototype.removeScore = function (score, value) {
        if (typeof score == 'object') {
            score.remove(this.selector, value);
        }
        else {
            command("scoreboard players remove " + this.selector + " " + score + " " + value);
        }
    };
    Player.prototype.getSelector = function () {
        return this.selector;
    };
    Player.prototype.toString = function () {
        return this.selector.toString();
    };
    return Player;
})();
var PlayerArray = (function (_super) {
    __extends(PlayerArray, _super);
    function PlayerArray(name, selector, createObjective) {
        if (name === void 0) { name = Naming.next('array'); }
        if (selector === void 0) { selector = Selector.allPlayer(); }
        if (createObjective === void 0) { createObjective = true; }
        _super.call(this, selector);
        this.name = name;
        this.name = name;
        var arrayScore;
        if (createObjective)
            arrayScore = new Score(name, "dummy");
        else
            arrayScore = new Score(name);
        if (typeof selector != 'undefined')
            arrayScore.set(selector, 1);
        Player.call(this, arrayScore.getSelector(1));
    }
    PlayerArray.prototype.addPlayer = function (selector) {
        if (selector === void 0) { selector = this.getSelector(); }
        this.arrayScore.set(selector.toString(), 1);
    };
    PlayerArray.prototype.removePlayer = function (selector) {
        if (selector === void 0) { selector = this.getSelector(); }
        this.arrayScore.set(selector.toString(), 0);
    };
    PlayerArray.prototype.getScore = function () {
        return this.arrayScore;
    };
    PlayerArray.prototype.toTeam = function (teamname) {
        if (teamname === void 0) { teamname = this.name; }
        var team = new Team(teamname);
        team.join(this.selector.toString());
        return team;
    };
    return PlayerArray;
})(Player);
var Selector = (function () {
    function Selector(selectorChar, attributes) {
        if (selectorChar === void 0) { selectorChar = "a"; }
        if (attributes === void 0) { attributes = {}; }
        this.selectorChar = selectorChar;
        this.attributes = attributes;
    }
    Selector.prototype.setAttribute = function (name, value) {
        this.attributes[name] = value;
    };
    Selector.prototype.setAttributes = function (newAttributes) {
        for (var name in newAttributes)
            this.setAttribute(name, newAttributes[name]);
    };
    Selector.prototype.removeAttribute = function (name) {
        delete this.attributes[name];
    };
    Selector.prototype.clone = function () {
        var atts = {};
        for (var key in this.attributes)
            if (this.attributes.hasOwnProperty(key))
                atts[key] = this.attributes[key];
        return new Selector(this.selectorChar, atts);
    };
    Selector.prototype.toString = function () {
        return Selector.buildSelector(this.selectorChar, this.attributes);
    };
    Selector.parse = function (stringSelector) {
        stringSelector = stringSelector.toString() || "@a[]";
        var selectorChar = stringSelector[1];
        var attributes = {};
        var attributeString = stringSelector.substring(3, stringSelector.length - 1);
        var attributeArray = attributeString.split(',');
        for (var i = 0; i < attributeArray.length; i++) {
            var attributeSplit = attributeArray[i].split('=');
            attributes[attributeSplit[0]] = attributeSplit[1];
        }
        return new Selector(selectorChar, attributes);
    };
    Selector.buildSelector = function (selectorChar, attributes) {
        if (attributes === void 0) { attributes = {}; }
        var sel = "@" + selectorChar;
        if (Object.keys(attributes).length < 1)
            return sel;
        sel += "[";
        for (var key in attributes) {
            sel += key + "=" + attributes[key] + ",";
        }
        sel = sel.substring(0, sel.length - 1);
        sel += "]";
        return sel;
    };
    Selector.player = function (attributes) {
        if (attributes === void 0) { attributes = {}; }
        return Selector.buildSelector("p", attributes);
    };
    Selector.randomPlayer = function (attributes) {
        if (attributes === void 0) { attributes = {}; }
        return Selector.buildSelector("r", attributes);
    };
    Selector.allPlayer = function (attributes) {
        if (attributes === void 0) { attributes = {}; }
        return Selector.buildSelector("a", attributes);
    };
    Selector.entities = function (attributes) {
        if (attributes === void 0) { attributes = {}; }
        return Selector.buildSelector("e", attributes);
    };
    return Selector;
})();
/// <reference path="base.ts"/>
/// <reference path="player.ts"/>
//region tellraw.js
function tellraw(message, selector) {
    if (selector === void 0) { selector = Selector.allPlayer(); }
    var t = new Tellraw();
    if (typeof message === "object")
        t.addExtra(message);
    else
        t.addText(message);
    t.tell(selector);
    return t;
}
var Tellraw = (function () {
    function Tellraw() {
        this.extras = [];
    }
    Tellraw.prototype.addText = function (text) {
        this.extras.push({ "text": text });
    };
    Tellraw.prototype.addScore = function (selector, objective) {
        this.extras.push({ "score": { "name": selector.toString(), "objective": objective } });
    };
    Tellraw.prototype.addSelector = function (selector) {
        this.extras.push({ "selector": selector.toString() });
    };
    Tellraw.prototype.addExtra = function (extra) {
        this.extras.push(extra.obj);
    };
    Tellraw.prototype.tell = function (selector) {
        if (selector === void 0) { selector = Selector.allPlayer(); }
        var extrasArray = JSON.stringify(this.extras);
        command('tellraw ' + selector + ' {"text":"",extra:' + extrasArray + '}');
    };
    return Tellraw;
})();
var TellrawExtra = (function () {
    function TellrawExtra(text) {
        if (text === void 0) { text = ""; }
        this.obj = { "text": text };
    }
    TellrawExtra.prototype.setText = function (newText) {
        this.setOption("text", newText);
    };
    TellrawExtra.prototype.setClickEvent = function (action, value) {
        this.setOption("clickEvent", { "action": action, "value": value });
    };
    TellrawExtra.prototype.setHoverEvent = function (action, value) {
        this.setOption("clickEvent", { "action": action, "value": value });
    };
    TellrawExtra.prototype.setColor = function (color) {
        this.setOption("color", color);
    };
    TellrawExtra.prototype.setOption = function (name, value) {
        this.obj[name] = value;
    };
    return TellrawExtra;
})();
var TellrawClickableExtra = (function (_super) {
    __extends(TellrawClickableExtra, _super);
    function TellrawClickableExtra(callback, text, options) {
        if (options === void 0) { options = {}; }
        _super.call(this, text);
        options.name = options.name || Naming.next("clickExtra").toLowerCase();
        _super.prototype.setClickEvent.call(this, "run_command", "/trigger " + options.name + "E add 1");
        var scoreEvent = new ScoreChangeEvent(new Score(options.name, "trigger"), options);
        EventHandler.events[(options.name)] = scoreEvent;
        var score = new Score(options.name + "E", "trigger", undefined, false);
        scoreEvent.addListener(function (player) {
            if (options.multipleClicks !== false)
                score.enableTrigger(Selector.allPlayer());
            callback(player);
        });
        score.enableTrigger(Selector.allPlayer());
        _super.prototype.setClickEvent = function () {
            throw "setting the click event command is not supported using TellrawClickableExtra";
        };
    }
    return TellrawClickableExtra;
})(TellrawExtra);
/// <reference path="base.ts"/>
/// <reference path="test.ts"/>
/// <reference path="tellraw.ts"/>
//region chat
function say(message) {
    command("say " + message);
}
var Formatting = {
    black: "§0",
    darkBlue: "§1",
    darkGreen: "§2",
    darkAqua: "§3",
    darkRed: "§4",
    darkPurple: "§5",
    gold: "§6",
    gray: "§7",
    darkGray: "§8",
    blue: "§9",
    green: "§a",
    aqua: "§b",
    red: "§c",
    lightPurple: "§d",
    yellow: "§e",
    white: "§f",
    obfuscated: "§k",
    bold: "§l",
    strikethrough: "§m",
    underlined: "§n",
    reset: "§r"
};
String.prototype.format = function (formatting) {
    return formatText(this, formatting);
};
function formatText(text, formatting) {
    if (formatting === void 0) { formatting = "§c"; }
    var words = text.split(" ");
    text = "";
    for (var i = 0; i < words.length; i++) {
        text += formatting + words[i];
    }
    return text.trim();
}
//endregion
//region title
function title(target, text, isSubtitle) {
    target = target || Selector.allPlayer();
    text = text || "No Text defined!";
    var t = new Title(text, isSubtitle);
    t.show(target);
    return t;
}
var TitleType;
(function (TitleType) {
    TitleType[TitleType["Subtitle"] = 0] = "Subtitle";
    TitleType[TitleType["Title"] = 1] = "Title";
})(TitleType || (TitleType = {}));
var Title = (function (_super) {
    __extends(Title, _super);
    function Title(text, type) {
        _super.call(this, text);
        this.titleType = type;
        _super.prototype.setClickEvent = function () {
            throw "Setting events is not supported for titles";
        };
        _super.prototype.setHoverEvent = function () {
            throw "Setting events is not supported for titles";
        };
    }
    Title.prototype.show = function (player) {
        if (player === void 0) { player = Selector.allPlayer(); }
        var json = JSON.stringify(this.obj);
        command("title " + player + " " + this.titleType.toString().toLowerCase() + " " + json);
    };
    Title.setTime = function (player, fadeIn, stay, fadeOut) {
        if (player === void 0) { player = Selector.allPlayer(); }
        if (fadeIn === void 0) { fadeIn = 1; }
        if (stay === void 0) { stay = 5; }
        if (fadeOut === void 0) { fadeOut = 1; }
        command("title " + player + " times " + fadeIn + " " + stay + " " + fadeOut);
    };
    Title.reset = function (player) {
        if (player === void 0) { player = Selector.allPlayer(); }
        command("title " + player + " reset");
    };
    Title.clear = function (player) {
        if (player === void 0) { player = Selector.allPlayer(); }
        command("title " + player + " clear");
    };
    return Title;
})(TellrawExtra);
//endregion title
//region scoreboard
var Score = (function () {
    function Score(name, type, displayName, addObjective) {
        if (name === void 0) { name = Naming.next("score"); }
        if (type === void 0) { type = "dummy"; }
        if (displayName === void 0) { displayName = undefined; }
        if (addObjective === void 0) { addObjective = true; }
        if (displayName === undefined)
            displayName = name;
        assert(name.length <= 16, "Cannot create Score with name \"" + name + "\" maximum name length is 16");
        if (addObjective)
            command("scoreboard objectives add " + name + " " + type + " " + displayName);
        this.name = name;
        this.type = type;
        this.displayName = displayName;
    }
    Score.prototype.set = function (player, value) {
        command("scoreboard players set " + player + " " + this.name + " " + value);
    };
    Score.prototype.add = function (player, value) {
        command("scoreboard players add " + player + " " + this.name + " " + value);
    };
    Score.prototype.remove = function (player, value) {
        command("scoreboard players remove " + player + " " + this.name + " " + value);
    };
    Score.prototype.reset = function (player) {
        command("scoreboard players reset " + player + " " + this.name);
    };
    Score.prototype.setDisplay = function (slot) {
        command("scoreboard objectives setdisplay " + slot + " " + this.name);
    };
    Score.prototype.enableTrigger = function (player) {
        if (this.type != "trigger")
            throw "Cannot enable trigger for non Trigger objective \"" + this.name + "\"";
        command("scoreboard players enable " + player + " " + this.name);
    };
    Score.prototype.test = function (player, callback, min, max) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 2147483648; }
        validate("scoreboard players test " + player + " " + this.name + " " + min + " " + max, callback);
    };
    Score.prototype.operation = function (player, operation, otherPlayer, otherObjective) {
        command("scoreboard players operation " + player + " " + this.name + " " + operation + " " + otherPlayer + " " + otherObjective);
    };
    Score.prototype.getSelector = function (min, max) {
        var minKey = "score_" + this.name + "_min";
        var maxKey = "score_" + this.name;
        var attributes = {};
        attributes[minKey] = min;
        if (typeof max != "undefined")
            attributes[maxKey] = max;
        return new Selector("a", attributes);
    };
    Score.prototype.getPlayer = function (min, max) {
        var reference = this.getSelector(min, max);
        return new PlayerArray(this.name, reference.toString());
    };
    return Score;
})();
var Team = (function () {
    function Team(name, addTeam) {
        if (name === void 0) { name = Naming.next("team"); }
        if (addTeam === void 0) { addTeam = true; }
        this.name = name;
        if (addTeam)
            command("scoreboard teams add " + this.name);
    }
    Team.prototype.empty = function () {
        command("scoreboard teams empty " + this.name);
    };
    Team.prototype.join = function (player) {
        command("scoreboard teams join " + this.name + " " + player);
    };
    Team.prototype.leave = function (player) {
        command("scoreboard teams leave " + this.name + " " + player);
    };
    Team.prototype.setOption = function (option, value) {
        command("scoreboard teams option " + this.name + " " + option + " " + value);
    };
    Team.prototype.getSelector = function () {
        return new Selector("a", { team: this.name });
    };
    Team.prototype.getPlayer = function () {
        var reference = this.getSelector();
        return new PlayerArray(this.name, reference.toString());
    };
    return Team;
})();
/// <reference path="util.ts"/>
/// <reference path="vanillaCommands.ts"/>
var McEvent = (function () {
    function McEvent() {
        this.listener = [];
    }
    McEvent.prototype.addListener = function (func) {
        this.listener.push(func);
    };
    McEvent.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < this.listener.length; i++) {
            this.listener[i].call(args);
        }
    };
    return McEvent;
})();
var EventHandler = (function () {
    function EventHandler() {
    }
    EventHandler.add = function (name, event) {
        if (EventHandler.events[name] !== null)
            throw "Cannot add Event \"" + name + "\" it already exists!";
        EventHandler.events[name] = event;
    };
    EventHandler.on = function (name, func) {
        this.events[name].addListener(func);
    };
    EventHandler.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.events[name].trigger(args);
    };
    return EventHandler;
})();
EventHandler.add("end", new CompiletimeEvent());
EventHandler.add("onmove", new ScoreChangeEvent(new Score("onmove", "stat.walkOneCm")));
EventHandler.add("oncrouch", new ScoreChangeEvent(new Score("oncrouch", "stat.crouchOneCm")));
EventHandler.add("onswim", new ScoreChangeEvent(new Score("onswim", "stat.swimOneCm")));
EventHandler.add("onsprint", new ScoreChangeEvent(new Score("onsprint", "stat.sprintOneCm")));
EventHandler.add("ondeath", new ScoreChangeEvent(new Score("ondeath", "deathCount"), 1, 2147483648, false));
EventHandler.add("onkill", new ScoreChangeEvent(new Score("onkill", "playerKillCount"), 2147483648, 1, false));
EventHandler.add("onentitykill", new ScoreChangeEvent(new Score("onentitykill", "totalKillCount"), 1, 2147483648, false));
var CompiletimeEvent = (function (_super) {
    __extends(CompiletimeEvent, _super);
    function CompiletimeEvent() {
        _super.apply(this, arguments);
    }
    return CompiletimeEvent;
})(McEvent);
var ScoreChangeEvent = (function (_super) {
    __extends(ScoreChangeEvent, _super);
    function ScoreChangeEvent(score, triggerAtMin, triggerAtMax, resetValue, removeFromValue) {
        if (triggerAtMin === void 0) { triggerAtMin = 1; }
        if (triggerAtMax === void 0) { triggerAtMax = 2147483648; }
        if (resetValue === void 0) { resetValue = true; }
        if (removeFromValue === void 0) { removeFromValue = 1; }
        _super.call(this);
        this.score = score;
        this.triggerAtMin = triggerAtMin;
        this.triggerAtMax = triggerAtMax;
        this.resetValue = resetValue;
        this.removeFromValue = removeFromValue;
        EventHandler.on("end", function () {
            var callback = function () {
                for (var name in EventHandler.events) {
                    var ev = EventHandler.events[name];
                    if (ev instanceof ScoreChangeEvent) {
                        call(ev.timerTick);
                    }
                }
            };
            var t = new Timer(callback, { time: 1, callAsync: true });
            ScoreChangeEvent.timer = t;
            ScoreChangeEvent.timer.start();
        });
    }
    ScoreChangeEvent.prototype.timerTick = function () {
        var sel = this.score.getSelector(this.triggerAtMin, this.triggerAtMax).toString();
        testforSync(sel);
        var player = this.score.getPlayer(this.triggerAtMin, this.triggerAtMax);
        _super.prototype.trigger.call(this, player);
        if (this.resetValue)
            this.score.reset(sel);
        else
            this.score.remove(sel, this.removeFromValue);
    };
    return ScoreChangeEvent;
})(McEvent);
/// <reference path="base.ts"/>
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
                api.placeBlock(parseInt(blockInfo[0]), parseInt(blockInfo[1]), this.position.x, this.position.y, this.position.z);
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
                api.placeSign(lines, parseInt(signDirection), this.position.x, this.position.y, this.position.z);
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
var TileNames;
(function (TileNames) {
    TileNames[TileNames["AIR"] = 0] = "AIR";
    TileNames[TileNames["STONE"] = 1] = "STONE";
    TileNames[TileNames["GRASS"] = 2] = "GRASS";
    TileNames[TileNames["DIRT"] = 3] = "DIRT";
    TileNames[TileNames["COBBLESTONE"] = 4] = "COBBLESTONE";
    TileNames[TileNames["PLANKS"] = 5] = "PLANKS";
    TileNames[TileNames["SAPLING"] = 6] = "SAPLING";
    TileNames[TileNames["BEDROCK"] = 7] = "BEDROCK";
    TileNames[TileNames["FLOWING_WATER"] = 8] = "FLOWING_WATER";
    TileNames[TileNames["WATER"] = 9] = "WATER";
    TileNames[TileNames["FLOWING_LAVA"] = 10] = "FLOWING_LAVA";
    TileNames[TileNames["LAVA"] = 11] = "LAVA";
    TileNames[TileNames["SAND"] = 12] = "SAND";
    TileNames[TileNames["GRAVEL"] = 13] = "GRAVEL";
    TileNames[TileNames["GOLD_ORE"] = 14] = "GOLD_ORE";
    TileNames[TileNames["IRON_ORE"] = 15] = "IRON_ORE";
    TileNames[TileNames["COAL_ORE"] = 16] = "COAL_ORE";
    TileNames[TileNames["LOG"] = 17] = "LOG";
    TileNames[TileNames["LEAVES"] = 18] = "LEAVES";
    TileNames[TileNames["SPONGE"] = 19] = "SPONGE";
    TileNames[TileNames["GLASS"] = 20] = "GLASS";
    TileNames[TileNames["LAPIS_ORE"] = 21] = "LAPIS_ORE";
    TileNames[TileNames["LAPIS_BLOCK"] = 22] = "LAPIS_BLOCK";
    TileNames[TileNames["DISPENSER"] = 23] = "DISPENSER";
    TileNames[TileNames["SANDSTONE"] = 24] = "SANDSTONE";
    TileNames[TileNames["NOTEBLOCK"] = 25] = "NOTEBLOCK";
    TileNames[TileNames["BED"] = 26] = "BED";
    TileNames[TileNames["GOLDEN_RAIL"] = 27] = "GOLDEN_RAIL";
    TileNames[TileNames["DETECTOR_RAIL"] = 28] = "DETECTOR_RAIL";
    TileNames[TileNames["STICKY_PISTON"] = 29] = "STICKY_PISTON";
    TileNames[TileNames["WEB"] = 30] = "WEB";
    TileNames[TileNames["TALLGRASS"] = 31] = "TALLGRASS";
    TileNames[TileNames["DEADBUSH"] = 32] = "DEADBUSH";
    TileNames[TileNames["PISTON"] = 33] = "PISTON";
    TileNames[TileNames["PISTON_HEAD"] = 34] = "PISTON_HEAD";
    TileNames[TileNames["WOOL"] = 35] = "WOOL";
    TileNames[TileNames["PISTON_MOVING"] = 36] = "PISTON_MOVING";
    TileNames[TileNames["YELLOW_FLOWER"] = 37] = "YELLOW_FLOWER";
    TileNames[TileNames["RED_FLOWER"] = 38] = "RED_FLOWER";
    TileNames[TileNames["BROWN_MUSHROOM"] = 39] = "BROWN_MUSHROOM";
    TileNames[TileNames["RED_MUSHROOM"] = 40] = "RED_MUSHROOM";
    TileNames[TileNames["GOLD_BLOCK"] = 41] = "GOLD_BLOCK";
    TileNames[TileNames["IRON_BLOCK"] = 42] = "IRON_BLOCK";
    TileNames[TileNames["DOUBLE_STONE_SLAB"] = 43] = "DOUBLE_STONE_SLAB";
    TileNames[TileNames["STONE_SLAB"] = 44] = "STONE_SLAB";
    TileNames[TileNames["BRICK_BLOCK"] = 45] = "BRICK_BLOCK";
    TileNames[TileNames["TNT"] = 46] = "TNT";
    TileNames[TileNames["BOOKSHELF"] = 47] = "BOOKSHELF";
    TileNames[TileNames["MOSSY_COBBLESTONE"] = 48] = "MOSSY_COBBLESTONE";
    TileNames[TileNames["OBSIDIAN"] = 49] = "OBSIDIAN";
    TileNames[TileNames["TORCH"] = 50] = "TORCH";
    TileNames[TileNames["FIRE"] = 51] = "FIRE";
    TileNames[TileNames["MOB_SPAWNER"] = 52] = "MOB_SPAWNER";
    TileNames[TileNames["OAK_STAIRS"] = 53] = "OAK_STAIRS";
    TileNames[TileNames["CHEST"] = 54] = "CHEST";
    TileNames[TileNames["REDSTONE_WIRE"] = 55] = "REDSTONE_WIRE";
    TileNames[TileNames["DIAMOND_ORE"] = 56] = "DIAMOND_ORE";
    TileNames[TileNames["DIAMOND_BLOCK"] = 57] = "DIAMOND_BLOCK";
    TileNames[TileNames["CRAFTING_TABLE"] = 58] = "CRAFTING_TABLE";
    TileNames[TileNames["WHEAT"] = 59] = "WHEAT";
    TileNames[TileNames["FARMLAND"] = 60] = "FARMLAND";
    TileNames[TileNames["FURNACE"] = 61] = "FURNACE";
    TileNames[TileNames["LIT_FURNACE"] = 62] = "LIT_FURNACE";
    TileNames[TileNames["STANDING_SIGN"] = 63] = "STANDING_SIGN";
    TileNames[TileNames["WOODEN_DOOR"] = 64] = "WOODEN_DOOR";
    TileNames[TileNames["LADDER"] = 65] = "LADDER";
    TileNames[TileNames["RAIL"] = 66] = "RAIL";
    TileNames[TileNames["STONE_STAIRS"] = 67] = "STONE_STAIRS";
    TileNames[TileNames["WALL_SIGN"] = 68] = "WALL_SIGN";
    TileNames[TileNames["LEVER"] = 69] = "LEVER";
    TileNames[TileNames["STONE_PRESSURE_PLATE"] = 70] = "STONE_PRESSURE_PLATE";
    TileNames[TileNames["IRON_DOOR"] = 71] = "IRON_DOOR";
    TileNames[TileNames["WOODEN_PRESSURE_PLATE"] = 72] = "WOODEN_PRESSURE_PLATE";
    TileNames[TileNames["REDSTONE_ORE"] = 73] = "REDSTONE_ORE";
    TileNames[TileNames["LIT_REDSTONE_ORE"] = 74] = "LIT_REDSTONE_ORE";
    TileNames[TileNames["UNLIT_REDSTONE_TORCH"] = 75] = "UNLIT_REDSTONE_TORCH";
    TileNames[TileNames["REDSTONE_TORCH"] = 76] = "REDSTONE_TORCH";
    TileNames[TileNames["STONE_BUTTON"] = 77] = "STONE_BUTTON";
    TileNames[TileNames["SNOW_LAYER"] = 78] = "SNOW_LAYER";
    TileNames[TileNames["ICE"] = 79] = "ICE";
    TileNames[TileNames["SNOW"] = 80] = "SNOW";
    TileNames[TileNames["CACTUS"] = 81] = "CACTUS";
    TileNames[TileNames["CLAY"] = 82] = "CLAY";
    TileNames[TileNames["REEDS"] = 83] = "REEDS";
    TileNames[TileNames["JUKEBOX"] = 84] = "JUKEBOX";
    TileNames[TileNames["FENCE"] = 85] = "FENCE";
    TileNames[TileNames["PUMPKIN"] = 86] = "PUMPKIN";
    TileNames[TileNames["NETHERRACK"] = 87] = "NETHERRACK";
    TileNames[TileNames["SOUL_SAND"] = 88] = "SOUL_SAND";
    TileNames[TileNames["GLOWSTONE"] = 89] = "GLOWSTONE";
    TileNames[TileNames["PORTAL"] = 90] = "PORTAL";
    TileNames[TileNames["LIT_PUMPKIN"] = 91] = "LIT_PUMPKIN";
    TileNames[TileNames["CAKE"] = 92] = "CAKE";
    TileNames[TileNames["UNPOWERED_REPEATER"] = 93] = "UNPOWERED_REPEATER";
    TileNames[TileNames["POWERED_REPEATER"] = 94] = "POWERED_REPEATER";
    TileNames[TileNames["STAINED_GLASS"] = 95] = "STAINED_GLASS";
    TileNames[TileNames["TRAPDOOR"] = 96] = "TRAPDOOR";
    TileNames[TileNames["MONSTER_EGG"] = 97] = "MONSTER_EGG";
    TileNames[TileNames["STONE_BRICK"] = 98] = "STONE_BRICK";
    TileNames[TileNames["HUGE_RED_MUSHROOM"] = 99] = "HUGE_RED_MUSHROOM";
    TileNames[TileNames["HUGE_BROWN_MUSHROOM"] = 100] = "HUGE_BROWN_MUSHROOM";
    TileNames[TileNames["IRON_BARS"] = 101] = "IRON_BARS";
    TileNames[TileNames["GLASS_PANE"] = 102] = "GLASS_PANE";
    TileNames[TileNames["MELON_BLOCK"] = 103] = "MELON_BLOCK";
    TileNames[TileNames["PUMPKIN_STEM"] = 104] = "PUMPKIN_STEM";
    TileNames[TileNames["MELON_STEM"] = 105] = "MELON_STEM";
    TileNames[TileNames["VINE"] = 106] = "VINE";
    TileNames[TileNames["FENCE_GATE"] = 107] = "FENCE_GATE";
    TileNames[TileNames["BRICK_STAIRS"] = 108] = "BRICK_STAIRS";
    TileNames[TileNames["STONE_BRICK_STAIRS"] = 109] = "STONE_BRICK_STAIRS";
    TileNames[TileNames["MYCELIUM"] = 110] = "MYCELIUM";
    TileNames[TileNames["WATERLILY"] = 111] = "WATERLILY";
    TileNames[TileNames["NETHER_BRICK"] = 112] = "NETHER_BRICK";
    TileNames[TileNames["NETHER_BRICK_FENCE"] = 113] = "NETHER_BRICK_FENCE";
    TileNames[TileNames["NETHER_BRICK_STAIRS"] = 114] = "NETHER_BRICK_STAIRS";
    TileNames[TileNames["NETHER_WART"] = 115] = "NETHER_WART";
    TileNames[TileNames["ENCHANTING_TABLE"] = 116] = "ENCHANTING_TABLE";
    TileNames[TileNames["BREWING_STAND"] = 117] = "BREWING_STAND";
    TileNames[TileNames["CAULDRON"] = 118] = "CAULDRON";
    TileNames[TileNames["END_PORTAL"] = 119] = "END_PORTAL";
    TileNames[TileNames["END_PORTAL_FRAME"] = 120] = "END_PORTAL_FRAME";
    TileNames[TileNames["END_STONE"] = 121] = "END_STONE";
    TileNames[TileNames["DRAGON_EGG"] = 122] = "DRAGON_EGG";
    TileNames[TileNames["REDSTONE_LAMP"] = 123] = "REDSTONE_LAMP";
    TileNames[TileNames["LIT_REDSTONE_LAMP"] = 124] = "LIT_REDSTONE_LAMP";
    TileNames[TileNames["DOUBLE_WOODEN_SLAB"] = 125] = "DOUBLE_WOODEN_SLAB";
    TileNames[TileNames["WOODEN_SLAB"] = 126] = "WOODEN_SLAB";
    TileNames[TileNames["COCOA"] = 127] = "COCOA";
    TileNames[TileNames["SANDSTONE_STAIRS"] = 128] = "SANDSTONE_STAIRS";
    TileNames[TileNames["EMERALD_ORE"] = 129] = "EMERALD_ORE";
    TileNames[TileNames["ENDER_CHEST"] = 130] = "ENDER_CHEST";
    TileNames[TileNames["TRIPWIRE_HOOK"] = 131] = "TRIPWIRE_HOOK";
    TileNames[TileNames["TRIPWIRE"] = 132] = "TRIPWIRE";
    TileNames[TileNames["EMERALD_BLOCK"] = 133] = "EMERALD_BLOCK";
    TileNames[TileNames["SPRUCE_STAIRS"] = 134] = "SPRUCE_STAIRS";
    TileNames[TileNames["BIRCH_STAIRS"] = 135] = "BIRCH_STAIRS";
    TileNames[TileNames["JUNGLE_STAIRS"] = 136] = "JUNGLE_STAIRS";
    TileNames[TileNames["COMMAND_BLOCK"] = 137] = "COMMAND_BLOCK";
    TileNames[TileNames["BEACON"] = 138] = "BEACON";
    TileNames[TileNames["COBBLESTONE_WALL"] = 139] = "COBBLESTONE_WALL";
    TileNames[TileNames["FLOWER_POT"] = 140] = "FLOWER_POT";
    TileNames[TileNames["CARROTS"] = 141] = "CARROTS";
    TileNames[TileNames["POTATOES"] = 142] = "POTATOES";
    TileNames[TileNames["WOODEN_BUTTON"] = 143] = "WOODEN_BUTTON";
    TileNames[TileNames["SKULL"] = 144] = "SKULL";
    TileNames[TileNames["ANVIL"] = 145] = "ANVIL";
    TileNames[TileNames["TRAPPED_CHEST"] = 146] = "TRAPPED_CHEST";
    TileNames[TileNames["LIGHT_WEIGHTED_PRESSURE_PLATE"] = 147] = "LIGHT_WEIGHTED_PRESSURE_PLATE";
    TileNames[TileNames["HEAVY_WEIGHTED_PRESSURE_PLATE"] = 148] = "HEAVY_WEIGHTED_PRESSURE_PLATE";
    TileNames[TileNames["UNPOWERED_COMPARATOR"] = 149] = "UNPOWERED_COMPARATOR";
    TileNames[TileNames["POWERED_COMPARATOR"] = 150] = "POWERED_COMPARATOR";
    TileNames[TileNames["DAYLIGHT_SENSOR"] = 151] = "DAYLIGHT_SENSOR";
    TileNames[TileNames["REDSTONE_BLOCK"] = 152] = "REDSTONE_BLOCK";
    TileNames[TileNames["QUARTZ_ORE"] = 153] = "QUARTZ_ORE";
    TileNames[TileNames["HOPPER"] = 154] = "HOPPER";
    TileNames[TileNames["QUARTZ_BLOCK"] = 155] = "QUARTZ_BLOCK";
    TileNames[TileNames["QUARTZ_STAIRS"] = 156] = "QUARTZ_STAIRS";
    TileNames[TileNames["ACTIVATOR_RAIL"] = 157] = "ACTIVATOR_RAIL";
    TileNames[TileNames["DROPPER"] = 158] = "DROPPER";
    TileNames[TileNames["STAINED_HARDENED_CLAY"] = 159] = "STAINED_HARDENED_CLAY";
})(TileNames || (TileNames = {}));

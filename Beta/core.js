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
 * Places �length� redstone dust.
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
 * Places repeaters to delay �time�. Will do nothing if �time� is zero.
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
     * Generates unique names with �name� as prefix. Will start at zero when giving a new name.
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
var EventTypes;
(function (EventTypes) {
    EventTypes[EventTypes["Move"] = 0] = "Move";
    EventTypes[EventTypes["Crouch"] = 1] = "Crouch";
    EventTypes[EventTypes["Swim"] = 2] = "Swim";
    EventTypes[EventTypes["Sprint"] = 3] = "Sprint";
    EventTypes[EventTypes["Death"] = 4] = "Death";
    EventTypes[EventTypes["Kill"] = 5] = "Kill";
    EventTypes[EventTypes["EntityKill"] = 6] = "EntityKill";
})(EventTypes || (EventTypes = {}));
var EventHandler = (function () {
    function EventHandler() {
    }
    EventHandler.on = function (name, func) {
        this.events.push({ name: func });
    };
    EventHandler.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.events.filter(function (x) { return x.name === name; }).forEach(function (x) { return x.name(args); });
    };
    EventHandler.events = [];
    return EventHandler;
})();
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
/// <reference path="base.ts"/>
/// <reference path="player.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        var scoreEvent = new ScoreChangeEvent(options.name, "trigger", options);
        EventHandler.events[scoreEvent.name] = scoreEvent;
        var score = new Score(options.name + "E", "trigger", undefined, false);
        scoreEvent.setListener(function (player) {
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
/// <reference path="tellraw.ts"/>
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
/// <reference path="test.ts"/>
/// <reference path="tellraw.ts"/>
//region chat
function say(message) {
    command("say " + message);
}
var Formatting = {
    black: "�0",
    darkBlue: "�1",
    darkGreen: "�2",
    darkAqua: "�3",
    darkRed: "�4",
    darkPurple: "�5",
    gold: "�6",
    gray: "�7",
    darkGray: "�8",
    blue: "�9",
    green: "�a",
    aqua: "�b",
    red: "�c",
    lightPurple: "�d",
    yellow: "�e",
    white: "�f",
    obfuscated: "�k",
    bold: "�l",
    strikethrough: "�m",
    underlined: "�n",
    reset: "�r"
};
String.prototype.format = function (formatting) {
    return formatText(this, formatting);
};
function formatText(text, formatting) {
    if (formatting === void 0) { formatting = "�c"; }
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
        if (displayName === void 0) { displayName = name; }
        if (addObjective === void 0) { addObjective = true; }
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

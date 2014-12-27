/// <reference path="base.ts"/>
/// <reference path="test.ts"/>
/// <reference path="tellraw.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    if (typeof formatting === "undefined") { formatting = "§c"; }
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
        if (typeof player === "undefined") { player = Selector.allPlayer(); }
        var json = JSON.stringify(this.obj);
        command("title " + player + " " + this.titleType.toString().toLowerCase() + " " + json);
    };

    Title.setTime = function (player, fadeIn, stay, fadeOut) {
        if (typeof player === "undefined") { player = Selector.allPlayer(); }
        if (typeof fadeIn === "undefined") { fadeIn = 1; }
        if (typeof stay === "undefined") { stay = 5; }
        if (typeof fadeOut === "undefined") { fadeOut = 1; }
        command("title " + player + " times " + fadeIn + " " + stay + " " + fadeOut);
    };

    Title.reset = function (player) {
        if (typeof player === "undefined") { player = Selector.allPlayer(); }
        command("title " + player + " reset");
    };

    Title.clear = function (player) {
        if (typeof player === "undefined") { player = Selector.allPlayer(); }
        command("title " + player + " clear");
    };
    return Title;
})(TellrawExtra);

//endregion title
//region scoreboard
var Score = (function () {
    function Score(name, type, displayName, addObjective) {
        if (typeof name === "undefined") { name = Naming.next("score"); }
        if (typeof type === "undefined") { type = "dummy"; }
        if (typeof displayName === "undefined") { displayName = undefined; }
        if (typeof addObjective === "undefined") { addObjective = true; }
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
        if (typeof min === "undefined") { min = 1; }
        if (typeof max === "undefined") { max = 2147483648; }
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
        if (typeof name === "undefined") { name = Naming.next("team"); }
        if (typeof addTeam === "undefined") { addTeam = true; }
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
//endregion

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
        if (typeof selector == "string")
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
        } else {
            if (typeof dest.yrot == 'undefined' || typeof dest.xrot != 'undefined')
                command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z);
            else
                command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z + " " + dest.yrot + " " + dest.xrot);
        }
    };

    Player.prototype.clear = function (item, data, maxCount, dataTag) {
        if (typeof item === "undefined") { item = ""; }
        if (typeof data === "undefined") { data = ""; }
        if (typeof maxCount === "undefined") { maxCount = ""; }
        if (typeof dataTag === "undefined") { dataTag = ""; }
        command("clear " + this.selector + " " + item + " " + data + " " + maxCount + " " + dataTag);
    };

    Player.prototype.tell = function (text) {
        command("tell " + this.selector + " " + text);
    };

    Player.prototype.tellraw = function (param) {
        if (typeof param == 'object') {
            param.tell(this.selector);
        } else {
            tellraw(this.selector, param);
        }
    };

    Player.prototype.setTeam = function (team) {
        if (typeof team == 'object') {
            team.join(this.selector);
        } else {
            command("scoreboard teams join " + team + " " + this.selector);
        }
    };

    Player.prototype.setScore = function (score, value) {
        if (typeof score == 'object') {
            score.set(this.selector, value);
        } else {
            command("scoreboard players set " + this.selector + " " + score + " " + value);
        }
    };

    Player.prototype.addScore = function (score, value) {
        if (typeof score == 'object') {
            score.add(this.selector, value);
        } else {
            command("scoreboard players add " + this.selector + " " + score + " " + value);
        }
    };

    Player.prototype.removeScore = function (score, value) {
        if (typeof score == 'object') {
            score.remove(this.selector, value);
        } else {
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
        if (typeof name === "undefined") { name = Naming.next('array'); }
        if (typeof selector === "undefined") { selector = Selector.allPlayer(); }
        if (typeof createObjective === "undefined") { createObjective = true; }
        _super.call(this, selector.toString());

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
        if (typeof selector === "undefined") { selector = this.getSelector(); }
        this.arrayScore.set(selector.toString(), 1);
    };

    PlayerArray.prototype.removePlayer = function (selector) {
        if (typeof selector === "undefined") { selector = this.getSelector(); }
        this.arrayScore.set(selector.toString(), 0);
    };

    PlayerArray.prototype.getScore = function () {
        return this.arrayScore;
    };

    PlayerArray.prototype.toTeam = function (teamname) {
        if (typeof teamname === "undefined") { teamname = this.name; }
        var team = new Team(teamname);
        team.join(this.selector.toString());
        return team;
    };
    return PlayerArray;
})(Player);

var Selector = (function () {
    function Selector(selectorChar, attributes) {
        if (typeof selectorChar === "undefined") { selectorChar = "a"; }
        if (typeof attributes === "undefined") { attributes = {}; }
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
        if (typeof attributes === "undefined") { attributes = {}; }
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
        if (typeof attributes === "undefined") { attributes = {}; }
        return Selector.buildSelector("p", attributes);
    };

    Selector.randomPlayer = function (attributes) {
        if (typeof attributes === "undefined") { attributes = {}; }
        return Selector.buildSelector("r", attributes);
    };

    Selector.allPlayer = function (attributes) {
        if (typeof attributes === "undefined") { attributes = {}; }
        return Selector.buildSelector("a", attributes);
    };

    Selector.entities = function (attributes) {
        if (typeof attributes === "undefined") { attributes = {}; }
        return Selector.buildSelector("e", attributes);
    };
    return Selector;
})();
//endregion

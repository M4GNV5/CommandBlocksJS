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
    if (typeof selector === "undefined") { selector = Selector.allPlayer(); }
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
        if (typeof selector === "undefined") { selector = Selector.allPlayer(); }
        var extrasArray = JSON.stringify(this.extras);
        command('tellraw ' + selector + ' {"text":"",extra:' + extrasArray + '}');
    };
    return Tellraw;
})();
var TellrawExtra = (function () {
    function TellrawExtra(text) {
        if (typeof text === "undefined") { text = ""; }
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
        if (typeof options === "undefined") { options = {}; }
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
//endregion

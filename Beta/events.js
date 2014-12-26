/// <reference path="util.ts"/>
/// <reference path="vanillaCommands.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
EventHandler.add("end", new CompiletimeEvent);
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

//#events.ts
/// <reference path="ref.ts"/>

class McEvent
{
	listener: Function[] = [];
	callAsync: boolean = false;

	addListener(func: Function): void
	{
		this.listener.push(func);
	}

	trigger(...args: any[]): void
	{
		for (var i = 0; i < this.listener.length; i++)
		{
			if (this.callAsync)
			{
				var that = this;
				call(function () { that.listener[i].apply(undefined, args); });
			}
			else
			{
				this.listener[i].apply(undefined, args);
			}
		}
	}
}

class EventHandler
{
	static events: { [index: string]: McEvent } = {};

	static add(name: string, ev: McEvent)
	{
		if (EventHandler.events[name] !== undefined)
			throw "Cannot add Event \"" + name + "\" it already exists!";
		EventHandler.events[name] = ev;
	}

	static on(name: string, func: Function): void
	{
		this.events[name].addListener(func);
	}

	static emit(name, ...args: any[]): void
	{
		this.events[name].trigger(args);
	}
}

class CompiletimeEvent extends McEvent
{ }

EventHandler.add("end", new CompiletimeEvent());

class ScoreChangeEvent extends McEvent
{
	static timer: Timer;

	score: Score;
	listenerArg: PlayerArray;
	isRunning: RuntimeInteger;

	scoreType: string;
	triggerAtMin: number;
	triggerAtMax: number;
	resetValue: boolean;
	removeFromValue: number;

	constructor(
		scoreType: string,
		triggerAtMin: number = 1,
		triggerAtMax: number = 2147483647,
		resetValue: boolean = true,
		removeFromValue: number = 1
		)
	{
		super();

		this.scoreType = scoreType;
		this.triggerAtMin = triggerAtMin;
		this.triggerAtMax = triggerAtMax;
		this.resetValue = resetValue;
		this.removeFromValue = removeFromValue;

		this.addListener = function (func: Function)
		{
			if (typeof this.isRunning == "undefined")
			{
				var name = Naming.next("onscore");
				this.score = new Score(name, this.scoreType);
				this.listenerArg = new PlayerArray(name + "A");
				this.isRunning = new RuntimeInteger(0, name);
			}
			this.listener.push(func);
		};
	}

	timerTick(): void
	{
		validateSync(this.isRunning.hasValue(0));

		var sel = this.score.getSelector(this.triggerAtMin, this.triggerAtMax).toString();
		testforSync(sel);

		this.isRunning.set(this.listener.length);

		this.listenerArg.removePlayer("@a");
		this.listenerArg.addPlayer(sel);

		if (this.resetValue)
			this.score.reset(sel);
		else
			this.score.remove(sel, this.removeFromValue);

		for (var i = 0; i < this.listener.length; i++)
		{
			var that = this;
			call(function ()
			{
				that.listener[i].call(undefined, that.listenerArg);
				that.isRunning.remove(1);
			});
		}
	}
}
EventHandler.on("end", function ()
{
	var callback = function ()
	{
		for (var name in EventHandler.events)
		{
			var ev = EventHandler.events[name];
			if (ev instanceof ScoreChangeEvent)
			{
				var scoreEvent: ScoreChangeEvent = <ScoreChangeEvent>ev;
				if (scoreEvent.listener.length < 1)
					continue;

				call(function () { scoreEvent.timerTick.call(scoreEvent); });
			}
		}
	}
	var t = new Timer(callback, { time: 5 });
	ScoreChangeEvent.timer = t;
	ScoreChangeEvent.timer.start();
});

EventHandler.add("move", new ScoreChangeEvent("stat.walkOneCm"));
EventHandler.add("crouch", new ScoreChangeEvent("stat.crouchOneCm"));
EventHandler.add("swim", new ScoreChangeEvent("stat.swimOneCm"));
EventHandler.add("sprint", new ScoreChangeEvent("stat.sprintOneCm"));
EventHandler.add("death", new ScoreChangeEvent("deathCount", 1, 2147483647, false));
EventHandler.add("kill", new ScoreChangeEvent("playerKillCount", 2147483647, 1, false));
EventHandler.add("entitykill", new ScoreChangeEvent("totalKillCount", 1, 2147483647, false));
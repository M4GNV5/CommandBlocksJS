/// <reference path="util.ts"/>
/// <reference path="vanillaCommands.ts"/>

class McEvent
{
	listener: Function[] = [];

	addListener(func: Function): void
	{
		this.listener.push(func);
	}

	trigger(...args: any[]): void
	{
		for (var i = 0; i < this.listener.length; i++)
		{
			var that = this;
			call(function () { that.listener[i].apply(undefined, args); } );
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
	triggerAtMin: number;
	triggerAtMax: number;
	resetValue: boolean;
	removeFromValue: number;

	constructor(
		score: Score,
		triggerAtMin: number = 1,
		triggerAtMax: number = 2147483648,
		resetValue: boolean = true,
		removeFromValue: number = 1
		)
	{
		super();

		this.score = score;

		this.triggerAtMin = triggerAtMin;
		this.triggerAtMax = triggerAtMax;
		this.resetValue = resetValue;
		this.removeFromValue = removeFromValue;

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
						call(function () { scoreEvent.timerTick.call(scoreEvent); });
					}
				}
			}
			var t = new Timer(callback, { time: 1, callAsync: true });
			ScoreChangeEvent.timer = t;
			ScoreChangeEvent.timer.start();
		});
	}

	timerTick(): void
	{
		var sel = this.score.getSelector(this.triggerAtMin, this.triggerAtMax).toString();
		testforSync(sel);
		var player = this.score.getPlayer(this.triggerAtMin, this.triggerAtMax);
		super.trigger(player);

		if (this.resetValue)
			this.score.reset(sel);
		else
			this.score.remove(sel, this.removeFromValue);
	}
}

EventHandler.add("onmove", new ScoreChangeEvent(new Score("onmove", "stat.walkOneCm")));
EventHandler.add("oncrouch", new ScoreChangeEvent(new Score("oncrouch", "stat.crouchOneCm")));
EventHandler.add("onswim", new ScoreChangeEvent(new Score("onswim", "stat.swimOneCm")));
EventHandler.add("onsprint", new ScoreChangeEvent(new Score("onsprint", "stat.sprintOneCm")));
EventHandler.add("ondeath", new ScoreChangeEvent(new Score("ondeath", "deathCount"), 1, 2147483648, false));
EventHandler.add("onkill", new ScoreChangeEvent(new Score("onkill", "playerKillCount"), 2147483648, 1, false));
EventHandler.add("onentitykill", new ScoreChangeEvent(new Score("onentitykill", "totalKillCount"), 1, 2147483648, false));
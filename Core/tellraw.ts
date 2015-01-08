//#tellraw.ts
/// <reference path="ref.ts"/>

//region tellraw.js
function tellraw(message, selector: string = Selector.allPlayer()): Tellraw
{
	var t = new Tellraw();
	if (typeof message === "object")
		t.addExtra(message);
	else
		t.addText(message);

	t.tell(selector);
	return t;
}

class Tellraw
{
	extras = [];

	addText(text: string): void
	{
		this.extras.push({ "text": text });
	}

	addScore(selector: Selector, objective: string): void
	{
		this.extras.push({ "score": { "name": selector.toString(), "objective": objective } });
	}

	addSelector(selector: Selector): void
	{
		this.extras.push({ "selector": selector.toString() });
	}

	addExtra(extra: TellrawExtra): void
	{
		this.extras.push(extra.obj);
	}

	tell(selector: string = Selector.allPlayer()): void
	{
		var extrasArray = JSON.stringify(this.extras);
		command('tellraw ' + selector + ' {"text":"",extra:' + extrasArray + '}');
	}
}
class TellrawExtra
{
	obj: {};

	constructor(text: string = "")
	{
		this.obj = { "text": text };
	}

	setText(newText: string): void
	{
		this.setOption("text", newText);
	}

	setClickEvent(action: string, value: string): void
	{
		this.setOption("clickEvent", { "action": action, "value": value });
	}

	setHoverEvent(action: string, value: string): void
	{
		this.setOption("clickEvent", { "action": action, "value": value });
	}

	setColor(color: string): void
	{
		this.setOption("color", color);
	}

	setOption(name: string, value: {}): void
	{
		this.obj[name] = value;
	}
}

class TellrawClickableExtra extends TellrawExtra
{
	constructor(callback: Function, text: string, options: any = {})
	{
		super(text);

		options.name = options.name || Naming.next("clickExtra").toLowerCase();

		super.setClickEvent("run_command", "/trigger " + options.name + "E add 1");

		var scoreEvent = new ScoreChangeEvent("trigger");
		EventHandler.events[<string>(options.name)] = scoreEvent;

		var score = new Score(options.name + "E", "trigger", undefined, false);

		scoreEvent.addListener(function (player)
		{
			if (options.multipleClicks !== false)
				score.enableTrigger(Selector.allPlayer());
			callback(player);
		});

		score.enableTrigger(Selector.allPlayer());

		super.setClickEvent = function () { throw "setting the click event command is not supported using TellrawClickableExtra"; };
	}
}
//endregion
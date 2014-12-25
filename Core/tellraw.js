//region tellraw.js
function tellraw(selector, message, isJson)
{
	selector = selector || Selector.allPlayer();
	message = message || "No Message defined!";

	var t = new Tellraw();
	if (isJson == true)
		t.addExtra(message);
	else
		t.addText(message);

	t.tell(selector);
}

function Tellraw()
{
	this.extras = [];

	this.addText = function(text)
	{
		this.extras.push({ "text": text.toString() });
	}
	this.addScore = function(selector, objective)
	{
		this.extras.push({ "score": { "name": selector.toString(), "objective": objective.toString() } });
	}
	this.addSelector = function(selector)
	{
		this.extras.push({ "selector": selector.toString() });
	}
	this.addExtra = function(extra)
	{
		this.extras.push(extra.obj);
	}

	this.tell = function(selector)
	{
		selector = selector || Selector.allPlayer();
		var extrasArray = JSON.stringify(this.extras);
		command('tellraw ' + selector + ' {"text":"",extra:' + extrasArray + '}');
	}
}
function TellrawExtra(text)
{
	text = text || "";
	this.obj = { "text": text };

	this.setText = function(newText)
	{
		this.setOption("text", newText);
	}
	this.setClickEvent = function(action, value)
	{
		this.setOption("clickEvent", { "action": action, "value": value });
	}
	this.setHoverEvent = function(action, value)
	{
		this.setOption("clickEvent", { "action": action, "value": value });
	}
	this.setColor = function(color)
	{
		this.setOption("color", color);
	}

	this.setOption = function(name, value)
	{
		this.obj[name] = value;
	}
}
function TellrawClickableExtra(callback, text, options)
{
	TellrawExtra.call(this, text);

	if (typeof callback == 'undefined')
		throw "Cannot create TellrawClickableExtra without callback";

	options = options || {};
	options.name = options.name || Naming.next("clickExtra").toLowerCase();

	this.setClickEvent("run_command", "/trigger " + options.name + "E add 1");

	var scoreEvent = new ScoreChangeEvent(options.name, "trigger", options);
	EventHandler.events[scoreEvent.name] = scoreEvent;

	var score = new Score(options.name + "E", "trigger", false, false);

	scoreEvent.setListener(function(player)
	{
		if (options.multipleClicks !== false)
			score.enableTrigger(Selector.allPlayer());
		callback(player);
	});

	score.enableTrigger(Selector.allPlayer());

	this.setClickEvent = function()
	{
		throw "setting the click event command is not supported using TellrawClickableExtra";
	}
}
TellrawClickableExtra.prototype = Object.create(TellrawExtra.prototype);
//endregion
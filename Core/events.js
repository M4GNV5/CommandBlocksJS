//region events.js
function Event(name)
{
	name = name || Naming.next("event");

	this.name = name.toLowerCase();
	this.listener = false;

	this.setListener = function(func)
	{
		if (typeof func == 'undefined')
			throw "Cannot add Listener to Event '" + name + "' Listener is undefined!";
		this.listener = func;
	};
	this.dispatch = function(arg)
	{
		if (this.listener)
			this.listener(arg);
	};
}

var EventHandler = function()
{
	this.events = {};

	this.events.onmove = new ScoreChangeEvent('onmove', 'stat.walkOneCm');
	this.events.oncrouch = new ScoreChangeEvent('oncrouch', 'stat.crouchOneCm');
	this.events.onswim = new ScoreChangeEvent('onswim', 'stat.swimOneCm');
	this.events.onsprint = new ScoreChangeEvent('onsprint', 'stat.sprintOneCm');

	this.events.ondeath = new ScoreChangeEvent('ondeath', 'deathCount', { "resetScore": false });
	this.events.onkill = new ScoreChangeEvent('onkill', 'playerKillCount', { "resetScore": false });
	this.events.onentitykill = new ScoreChangeEvent('onentitykill', 'totalKillCount', { "resetScore": false });

	this.setEventListener = function(name, listener)
	{
		name = name.toLowerCase();
		if (typeof EventHandler.events[name] == 'undefined')
			throw "Cannot add Listener to Event '" + name + "' it does not exist!";
		EventHandler.events[name].setListener(listener);
	};
	this.dispatch = function(name, arg)
	{
		name = name.toLowerCase();
		if (typeof this.events[name] == 'undefined')
			throw "Cannot dispatch Event '" + name + "' it does not exist!";
		this.events[name].dispatch(arg);
	};
};

function ScoreChangeEvent(name, objectiveType, options)
{
	name = name || Naming.next("scoreEvent");

	Event.call(this, name);

	objectiveType = objectiveType || "dummy";

	options = options || {};
	options.triggerOnValue = options.triggerOnValue || 1;
	options.refreshTimer = options.refreshTimer || 9;
	options.removeFromScore = options.removeFromScore || 1;

	var objective = new Score(this.name + "E");
	var player;

	this.checkForChange = function()
	{
		var reference = objective.getSelector(options.triggerOnValue);
		player.addPlayer(reference);

		var resetScore = options.resetScore;
		var removeFromScore = options.removeFromScore;

		testfor(reference, function()
		{
			if (resetScore === false)
				objective.remove(reference, removeFromScore);
			else
				objective.set(reference, 0);

			EventHandler.dispatch(name, player);
		});
	};
	this.getSelector = function()
	{
		return objective.getSelector(options.triggerOnValue);
	};
	this.setListener = function(func)
	{
		var oldListener = this.listener;
		this.listener = function(player)
		{
			func(player);
			player.removePlayer();
		};
		if (!oldListener)
		{
			if (options.createObjective !== false)
				objective = new Score(this.name + "E", objectiveType);

			player = new PlayerArray(this.name);
			timer(options.refreshTimer, this.checkForChange);
		}
	};
}
ScoreChangeEvent.prototype = Object.create(Event.prototype);

function DayLightEvent(name, triggerAt)
{
	Event.call(this, name);
	this.prototype = new Event(name);

	OutputHandler.addFunction(function()
	{
		block(151);
		wire(triggerAt);
		this.dispatch(triggerAt);
	});
}
DayLightEvent.prototype = Object.create(Event.prototype);
//endregion

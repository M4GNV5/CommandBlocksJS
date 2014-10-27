//region events.js
function Event(name)
{
	this.name = name.toLowerCase();
	this.listener = false;

	this.setListener = function(func)
	{
		if(typeof func == 'undefined')
			throw "Cannot add Listener to Event '"+name+"' Listener is undefined!";
		this.listener = func;
	}
	this.dispatch = function(arg)
	{
		if(this.listener)
			this.listener(arg);
	}
}

var EventHandler = new function()
{
	this.events = {};

	this.events['onmove'] = new ScoreChangeEvent('onmove', 'stat.walkOneCm');
	this.events['oncrouch'] = new ScoreChangeEvent('oncrouch', 'stat.crouchOneCm');
	this.events['onswim'] = new ScoreChangeEvent('onswim', 'stat.swimOneCm');
	this.events['onsprint'] = new ScoreChangeEvent('onsprint', 'stat.sprintOneCm');

	this.events['ondeath'] = new ScoreChangeEvent('ondeath', 'deathCount');
	this.events['onkill'] = new ScoreChangeEvent('onkill', 'playerKillCount');
	this.events['onentitykill'] = new ScoreChangeEvent('onentitykill', 'totalKillCount');

	this.setEventListener = function(name, listener)
	{
		name = name.toLowerCase();
		if(typeof EventHandler.events[name] == 'undefined')
			throw "Cannot add Listener to Event '"+name+"' it does not exist!";
		EventHandler.events[name].setListener(listener);
	}
	this.dispatch = function(name, arg)
	{
		name = name.toLowerCase();
		if(typeof this.events[name] == 'undefined')
			throw "Cannot dispatch Event '"+name+"' it does not exist!";
		this.events[name].dispatch(arg);
	}
}
	

function ScoreChangeEvent(name, objectiveType, triggerOnValue, refreshTimer)
{
	Event.call(this, name);

	triggerOnValue = triggerOnValue || 1;
	refreshTimer = refreshTimer || 9;
	objectiveType = objectiveType || "dummy";

	this.name = name;

	var objective = new Score(this.name+"E");
	var player;

	this.checkForChange = function()
	{
		var reference = objective.getSelector(triggerOnValue);
		player.addPlayer(reference);
		testfor(reference, function()
		{
			EventHandler.dispatch(name, player);
		});
		objective.set(reference, 0);
	}
	this.getSelector = function()
	{
		return objective.getSelector(triggerOnValue);
	}
	this.setListener = function(func)
	{
		if(!this.listener)
		{
			objective = new Score(name+"E", objectiveType);
			player = new PlayerArray(name);
			timer(refreshTimer, this.checkForChange);
		}
		this.listener = function(player)
		{
			func(player);
			player.removePlayer();
		};
	}
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

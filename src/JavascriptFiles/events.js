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

	this.events['onmove'] = new ScoreChangeEvent('onmove', 'movecm', 'stat.walkOneCm');
	this.events['oncrouch'] = new ScoreChangeEvent('oncrouch', 'crouchcm', 'stat.crouchOneCm');
	this.events['onswim'] = new ScoreChangeEvent('onswim', 'swimcm', 'stat.swimOneCm');
	this.events['onsprint'] = new ScoreChangeEvent('onsprint', 'sprintcm', 'stat.sprintOneCm');

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

	this.checkForChange = function()
	{
		var reference = this.objective.getSelector(triggerOnValue);
		var name = this.base.name;
		var player = new PlayerArray(this.name, reference);
		testfor(reference, function()
		{
			EventHandler.dispatch(name, player);
		});
		this.objective.set(reference, 0);
	}
	this.getSelector = function()
	{
		return this.objective.getSelector(triggerOnValue);
	}
	this.setListener = function(func)
	{
		if(!this.base.listener)
		{
			this.objective = new Score(this.name+"Internal", objectiveType, this.name+"Event");
			timer(refreshTimer, this.checkForChange);
		}
		Event.prototype.setListener.call(this, function(player)
		{
			func(player);
			player.removePlayer();
		});
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

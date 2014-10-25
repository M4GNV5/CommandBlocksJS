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
	this.events['onkill'] = new ScoreChangeEvent('ondeath', 'playerKillCount');
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
	

function ScoreChangeEvent(name, objective, objectiveType, triggerOnValue, refreshTimer)
{
	triggerOnValue = triggerOnValue || 1;
	refreshTimer = refreshTimer || 9;
	objectiveType = objectiveType || objective;

	this.base = new Event(name);
	this.name = this.base.name;
	this.objective = objective;

	var reference = "@a[score_"+objective+"_min="+triggerOnValue+"]";

	this.checkForChange = function()
	{
		var player = new PlayerArray(name+'EP', reference);
		testfor(reference, function()
			{
				EventHandler.dispatch(name.toLowerCase(), player);
			});
		command("scoreboard players set "+reference+" "+objective+" 0");
	}

	this.getSelector = function()
	{
		return reference;
	}
	this.setListener = function(func)
	{
		if(!this.base.listener)
		{
			command("scoreboard objectives add "+objective+" "+objectiveType);
			timer(refreshTimer, this.checkForChange);
		}
		this.base.setListener(function(player) { func(player); player.removePlayer(); });
	}
	this.dispatch = function(arg)
	{
		this.base.dispatch(arg);
	}
}

function DayLightEvent(name, triggerAt)
{
	this.prototype = new Event(name);

	OutputHandler.addFunction(function()
	{
		block(151);
		wire(triggerAt);
		this.dispatch(triggerAt);
	});
}
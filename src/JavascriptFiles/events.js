function Event(name)
{
	this.name = name.toLowerCase();
	this.listener = [];

	this.addListener = function(func)
	{
		if(typeof func == 'undefined')
			throw "Cannot add Listener to Event '"+name+"' Listener is undefined!";
		this.listener.push(func);
	}
	this.dispatch = function(arg)
	{
		for(var i = 0; i < this.listener.length; i++)
		{
			call(function() { this.listener[i](arg); });
		}
	}
}

var EventHandler = new function()
{
	//this.events = {};
	/*this.events['onplayermove'] = new ScoreChangeEvent('onplayermove', 'movecm', 'stat.walkOneCm');
	this.events['onplayercrouch'] = new ScoreChangeEvent('onplayercrouch', 'crouchcm', 'stat.crouchOneCm');
	this.events['onplayerswim'] = new ScoreChangeEvent('onplayerswim', 'swimcm', 'stat.swimOneCm');
	this.events['onplayersprint'] = new ScoreChangeEvent('onplayersprint', 'sprintcm', 'stat.sprintOneCm');*/

	this.addEventListener = function(name, listener)
	{
		/*name = name.toLowerCase();
		if(typeof EventHandler.events[name] == 'undefined')
			throw "Cannot add Listener to Event '"+name+"' it does not exist!";
		EventHandler.events[name].addListener(listener);*/
	}
	this.dispatch = function(name, arg)
	{
		/*name = name.toLowerCase();
		if(typeof this.events[name] == 'undefined')
			throw "Cannot dispatch Event '"+name+"' it does not exist!";
		this.events[name].dispatch(arg);*/
	}
}
	

function ScoreChangeEvent(name, objective, objectiveType, triggerOnValue)
{
	triggerOnValue = triggerOnValue || 1;

	this.base = new Event(name);

	this.reference = "@a[score_"+name+"_min="+triggerOnValue+"]";

	this.checkForChange = function()
	{
		testfor(this.reference, function()
			{
				this.base.dispatch(this.reference);
				command("scoreboard players set "+this.reference+" "+this.base.name+" 0");
			});
	}

	this.addListener = function(func)
	{
		if(this.base.listener.length == 0)
		{
			command("scoreboard objectives add "+objective+" "+objectiveType);
			timer(5, this.checkForChange);
		}
		this.base.addListener(func);
	}
	this.dispatch = function(arg)
	{
		this.base.dispatch(arg);
	}
}
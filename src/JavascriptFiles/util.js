﻿function validate(cmd, callback)
{
	delay();
	sidewards(function()
		{
			command(cmd, false);
			comparator();
			call(callback, false);
		});
}
function validateSync(cmd)
{
	cmd = cmd || 'say CommandBlocksJS error invalid call "validateSync();"';
	command(cmd);
	comparator();
}
function testfor(statement, callback)
{
	validate('testfor '+statement, callback);
}
function testforblock(statement, callback)
{
	validate('testforblock '+statement, callback);
}

var Selector = new function()
{
	this.player = function(attributes)
	{
		return this.getSelector('p', attributes);
	}
	this.randomPlayer = function(attributes)
	{
		return this.getSelector('r', attributes);
	}
	this.allPlayers = function(attributes)
	{
		return this.getSelector('a', attributes);
	}
	this.entities = function(attributes)
	{
		return this.getSelector('e', attributes);
	}

	this.getSelector = function(selectorChar, attributes)
	{
		attributes = attributes || {};
		var sel = "@"+selectorChar;

		if(Object.keys(attributes).length < 1)
			return sel;

		sel += "[";
		for(var key in attributes)
		{
			sel += key+"="+attributes[key]+",";
		}
		sel = sel.substring(0, sel.length-1);
		sel += "]";

		return sel;
	}
}

function PlayerArray(name, selector)
{
	if(typeof name == 'undefined')
		throw 'Error cant create PlayerArray without name';
	this.name = name;

	command("scoreboard objectives add "+name+" dummy");
	if(typeof selector != 'undefined')
		command("scoreboard players set "+selector+" "+this.name+" 1");

	this.getPlayer = function()
	{
		return "@a[score_"+this.name+"_min=1]";
	}
	this.addPlayer = function(selector)
	{
		command("scoreboard players set "+selector+" "+this.name+" 1");
	}
	this.removePlayer = function(selector)
	{
		command("scoreboard players set "+selector+" "+this.name+" 0");
	}
}
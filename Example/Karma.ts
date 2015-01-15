/// <reference path="../Core/API.ts"/>

// setup karma scoreboard objective
// name: karma, type: dummy, displayName: Karma
var karma = new Score("karma", "dummy", "Karma");
// set display slot to sidebar
karma.setDisplay("sidebar");

command("scoreboard objectives setdisplay sidebar onscore1");

// subscribe to the 'onentitykill' event
EventHandler.on('entitykill', function (player)
{
	// tell the player he just earned karma
	tellraw("You just earned one Karma".format(Formatting.red), player.getSelector());
	// add 1 karma
	karma.add(player.getSelector().toString(), 1);
});
// subscribe to the 'ondeath' event
EventHandler.on('death', function (player)
{
	// save selector of the dead player in local variable
	var playerSelector = player.getSelector();

	// setup tellraw command that tells him his karma
	var karmaMessage = new Tellraw();
	// add Text 'The Player <name> had a Karma of <value>'
	karmaMessage.addText("The Player ");
	karmaMessage.addSelector(playerSelector);
	karmaMessage.addText(" had a Karma of ");
	karmaMessage.addScore(playerSelector, "karma");

	// tell the message to everybody
	karmaMessage.tell("@a");

	// reset karma
	karma.set(playerSelector.toString(), 0);
});
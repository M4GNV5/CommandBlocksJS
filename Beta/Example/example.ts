/// <reference path="../base.ts"/>
/// <reference path="../events.ts"/>
/// <reference path="../util.ts"/>
/// <reference path="../vanillaCommands.ts"/>
/// <reference path="../outputParser.ts"/>
/// <reference path="../player.ts"/>
/// <reference path="../runtimeVariables.ts"/>
/// <reference path="../tellraw.ts"/>
/// <reference path="../test.ts"/>
/// <reference path="../tilenames.ts"/>

// setup karma scoreboard objective
// name: karma, type: dummy, displayName: Karma
var karma = new Score("karma", "dummy", "Karma");
// set display slot to sidebar
karma.setDisplay("sidebar");

// subscribe to the 'onentitykill' event
EventHandler.on('onentitykill', function (player)
{
	// tell the player he just earned karma
	tellraw(player.getSelector(), "You just earned one Karma".format(Formatting.red));
	// add 1 karma
	karma.add(player.getSelector(), 1);
});
// subscribe to the 'ondeath' event
EventHandler.on('ondeath', function (player)
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
	karma.set(playerSelector, 0);
});
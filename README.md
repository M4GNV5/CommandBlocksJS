#CommandBlocksJS
CommandBlocksJS allows you to translate Javascript code to minecraft CommandBlocks

##Documentation
moved to the [Wiki](https://github.com/M4GV5/CommandBlocksJS/wiki)

##Example 1
###Output
[![Cmd](http://i.imgur.com/CEpe3lL.png)]()
###code
```javascript
//setup karma scoreboard objective
//name: karma, type: dummy, displayName: Karma
var karma = new Score("karma", "dummy", "Karma");
//set display slot to sidebar
karma.setDisplay("sidebar");

//subscribe to the 'onentitykill' event
EventHandler.setEventListener('onentitykill', function(player)
{
	//tell the player he just earned karma
	tellraw(player.getSelector(), "You just earned one Karma".format(Formatting.red));
	//add 1 karma
	karma.add(player.getSelector(), 1);
});
EventHandler.setEventListener('ondeath', function(player)
{
	//save selector of the dead player in local variable
	var playerSelector = player.getSelector();
	//setup tellraw command that tells him his karma
	//TODO implement 1.8 tellraw updates
	var cmdText = 'tellraw '+playerSelector+' {"text":"Your Karma was -","extra":[{"score":{"name":"'+playerSelector+'","objective":"karma"}}]}';
	
	//execute tellraw command
	command(cmdText);
	//reset karma
	karma.set(playerSelector, 0);
});
```

##Example 2

###Output
[![Cmd](http://i.imgur.com/7PoLwI0.png)]()

###Code
```javascript
say("Welcome to this map created by <yourName>"); //broadcast message



//set up scoreboard objective
var timePlayed = new Score("timePlayed", "dummy", "Time Played");
//set scoreboard objective display
timePlayed.setDisplay("sidebar");

//timer helper scoreboard
var timerHelper = new Score("timerHelper", "dummy");
//set scoreboard objective display
timerHelper.setDisplay("list");

timer(10, function() //timer function
{
	timerHelper.add(Selector.allPlayer(), 1);
	
	//test if a player has played 60 seconds
	testfor(timerHelper.getSelector(60), function()
	{
		timePlayed.add(Selector.allPlayer(), 1); //add 1 to all players online
		timerHelper.set(timerHelper.getSelector(58), 0);
	});
});



//set event whenever a player kills an entity
EventHandler.setEventListener('onentitykill', function(player)
{
	tellraw(player.getSelector(), "You cruel boy".format(Formatting.red));
});

```



##License
CommandBlocksJS is published under the 4 clause BSD license what means you can use source and binary for everything but your project needs to include the following clause: "This product includes software developed by Jakob Löw (M4GNV5)."

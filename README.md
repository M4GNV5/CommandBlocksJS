#CommandBlocksJS
CommandBlocksJS allows you to translate Javascript code to minecraft CommandBlocks

##Documentation
moved to the [Wiki](https://github.com/M4GV5/CommandBlocksJS/wiki)

##Example
###Output
[![Cmd](http://i.imgur.com/TxrpUGN.png)]()
###Code
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
//subscribe to the 'ondeath' event
EventHandler.setEventListener('ondeath', function(player)
{
    //save selector of the dead player in local variable
    var playerSelector = player.getSelector();

    //setup tellraw command that tells him his karma
    var karmaMessage = new tellraw();
    //Add Text 'The Player <name> had a Karma of <valua>'
    karmaMessage.addText("The Player ");
    karmaMessage.addSelector(playerSelector);
    karmaMessage.addText(" had a Karma of ");
    karmaMessage.addScore(playerSelector, "karma");
    
    //tell the message to everybody
    karmaMessage.tell("@a");

    //reset karma
    karma.set(playerSelector, 0);
});
```

For more Examples see https://github.com/M4GV5/CommandBlocksJS/tree/master/src/Examples



##License
CommandBlocksJS is published under the 4 clause BSD license what means you can use source and binary for everything but your project needs to include the following clause: "This product includes software developed by Jakob Löw (M4GNV5)."

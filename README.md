#CommandBlocksJS
CommandBlocksJS allows you to translate Javascript code to minecraft CommandBlocks

##Documentation
moved to the [Wiki](https://github.com/M4GV5/CommandBlocksJS/wiki)

##Example
```javascript
testfor("@a", function() //only start if players are online
	{
		//broadcast welcome message
		command("say Hello @a welcome to the map <mapName>");

		//this will build 'gameStart' inside of the current function
		gameStart(5);
	});

//this will be executed asyncrously to the testfor function
command("say this map was created by <yourName>");

function gameStart(timer)
{
	timer = timer || 3;

	//note that the for loop is executed in javascript
	//so it will build 5 commandblocks and 25 repeater NOT a for loop
	for(var i = timer; i > 0; i--)
	{
		//broadcast timer
		command("say Game starts in "+i+" seconds!");

		//1 repeater delays 0.1 seconds => 10 repeater delay 1 second
		delay(10);
	}

	command("say Game will start now!");

	//this will build 'gamelogic' as a standalone procdure
	//you should always use 'call(function);' if a function is used 2 times or more
	call(gamelogic);
}

function gamelogic()
{
	//TODO implement your game logic here!
}
```

##License
CommandBlocksJS is published under the 4 clause BSD license what means you can use source and binary for everything but your project needs to include the following clause: "This product includes software developed by Jakob Löw (M4GNV5)."

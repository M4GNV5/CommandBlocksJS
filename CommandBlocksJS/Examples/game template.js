//broadcast welcome message
say("Welcome to this map created by <yourName>".format(Formatting.red+Formatting.bold));

//setup startup countdown
var startCountdown = new Score("startCountdown", "dummy");
//start at 5
startCountdown.set(Selector.allPlayer(), 5);
//timer function
timer(10, function() 
{
    //setup tellraw message
    var message = new Tellraw();

    //setup tellraw message texts
    var text1 = "Game will start in ".format(Formatting.red+Formatting.bold);
    var text2 = " seconds".format(Formatting.red+Formatting.bold);

    //add texts and scoreboard value to tellraw command
    message.addText(text1);
    message.addScore(Selector.allPlayer(), startCountdown.name);
    message.addText(text2);

    //tell message to everybody has a startCountdown value >= 1
    message.tell(startCountdown.getSelector(1));

    //remove 1 from countdown for everybody who has a startCountdown value >= 1
    startCountdown.remove(startCountdown.getSelector(1), 1);

    //testfor people with startCountdown value of 0
    testfor(startCountdown.getSelector(0, 0), startGame);
});

function startGame()
{
    //TODO implement game logic
}

//set up scoreboard objective
var timePlayed = new Score("timePlayed", "dummy", "Time Played");
//set scoreboard objective display
timePlayed.setDisplay("sidebar");
//timer function
timer(
    10, //one timer tick every 10 * 0.1 seconds
    function() { timePlayed.add(Selector.allPlayer(), 1); },
    60 //callback is executed every 60 timer ticks
);

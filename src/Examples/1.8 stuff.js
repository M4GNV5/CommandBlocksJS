//Note: this example has no real use but describes how to profit from
//cool mc1.8 = CommandblocksJS 1.2 features



//create tellraw object
var myTellrawMessage = new Tellraw();

//adding scores and player selectors to tellraw messages
myTellrawMessage.addScore("player", "objectiveName");
myTellrawMessage.addSelector("@r");

//adding tellraw extras
var myExtra = new TellrawExtra();
myExtra.setText("some text");
myExtra.setColor("red");
myExtra.setOption("bold", true);

//add extra to tellraw message
myTellrawMessage.addExtra(myExtra);

//using score change event and trigger command & objective
//for executing function when player clicks on chat message
var myClickable = new TellrawClickableExtra(function(player)
{
    say(player.getSelector()+" clicked it!");
});
//TellrawClickableExtra has all tellrawExtra methods
myClickable.setColor("red");

//add extra to tellraw message
myTellrawMessage.addExtra(myClickable);

//tell message to random player
//calling tell without argument tells it to @a
myTellrawMessage.tell(Selector.randomPlayer());



//create title object with given text
//for creating subtitles use new Title("text", true);
var myTitle = new Title("titles are annoying");

//Title has all tellrawExtra methods
myTitle.setColor("red");

//show title to random player
myTitle.show("@r");

//Title has 3 static methods:
//reset([player]), clear([player]) and setTime([player], fadeIn, stay, fadeOut)
//not giving player means @a
//note if you dont want to give a player to setTime use setTime(false, ...)
delay(15);
Title.clear();

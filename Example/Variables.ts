/// <reference path="../Core/API.ts"/>

var myInt: Runtime.Integer;
var myFrac: Runtime.Fraction;
callOnce(function ()
{
	myInt = new Runtime.Integer(1);
	myFrac = new Runtime.Fraction(new Runtime.Integer(3), new Runtime.Integer(8));
});

myInt.multiplicate(2);

myFrac.multiplicate(2);
myFrac.isBetween(5, undefined, function ()
{
	myFrac.reduceToLowest();
});

var tellraw = new Chat.Tellraw("Current values:\n");
tellraw.extra.push(
	myInt.toTellrawExtra(),
	new Chat.Message("\n")
	);
tellraw.extra = tellraw.extra.concat(myFrac.toExactTellrawExtra());
tellraw.tell(new Entities.Player("@a"));


/// <reference path="../Core/API.ts"/>

//start at radius
var startRadius = 1;
//stop at radius
var stopRadius = 20;

var radius = new Runtime.Integer(startRadius);
var timer = new Util.Timer(calculateNext, 1);
timer.start();

command("scoreboard objectives setdisplay sidebar stdInteger");

function calculateNext()
{
	var circumference = new Runtime.Decimal();
	var area = new Runtime.Decimal();

	var pi = Runtime.Decimal.Pi;

	// C = 2 * pi * r
	circumference.set(radius);
	circumference.multiplicate(pi);
	circumference.multiplicate(2);

	// A = r * r * pi
	area.set(radius);
	area.multiplicate(area);
	area.multiplicate(pi);

	// output current values
	Chat.Tellraw.create(
		"r = ",
		radius.toTellrawExtra(),
		", C = ",
		circumference.toExactTellrawExtra(),
		", A = ",
		area.toExactTellrawExtra()
	).tell(new Entities.Player("@a"));

	//add one to radius
	radius.add(1);

	radius.isBetween(stopRadius, undefined, function ()
	{
		timer.stop();
	});
}

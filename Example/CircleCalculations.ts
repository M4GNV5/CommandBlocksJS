/// <reference path="../Core/API.ts"/>

//start at radius
var startRadius = 1;
//stop at radius
var stopRadius = 20;
//step
var step = 1;

var radius = new Runtime.Decimal(startRadius);

call(calculate);

function calculate()
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

	//add step to radius
	radius.add(step);

	//if radius is between startRadius and stopRadius call calculate
	radius.isBetween(startRadius, stopRadius, calculate);
}

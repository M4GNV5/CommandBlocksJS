/// <reference path="../Core/API.ts"/>

// uncomment if u want to get eye cancer :3
Runtime.Integer.score.setDisplay(Scoreboard.DisplaySlot.sidebar);

var start = 0; // try -3.12
var stop = 3;
var step = new Runtime.Decimal(0.39); // = pi/

var value = new Runtime.Decimal(start);

call(calculateSinus);

function calculateSinus()
{
	var result = new Runtime.Decimal();

	Util.Math.sin(value, result, function ()
	{
		Chat.Tellraw.create("Sinus of ", value.toExactTellrawExtra(), " is ", result.toExactTellrawExtra()).tell(Entities.Selector.AllPlayer);

		value.add(step);

		value.isBetween(start, stop, calculateSinus);
	});
}

// TODO Pythagoras, cos ...


/// <reference path="../Core/API.ts"/>

// uncomment if u want to get eye cancer :3
// Runtime.Integer.score.setDisplay(Scoreboard.DisplaySlot.sidebar);

//try -3.12 as start value
var sinValue = new Runtime.Decimal(0);

var pythValue = new Runtime.Integer(1);

call(calculateSinus);

function calculateSinus()
{
	var result = new Runtime.Decimal();

	Util.Math.sin(sinValue, result, function ()
	{
		Chat.Tellraw.create("Sinus of ", sinValue.toExactTellrawExtra(), " is ", result.toExactTellrawExtra()).tell(Entities.Selector.AllPlayer);

		sinValue.add(0.39);

		// from infinite to 3
		// when finished start pythagoras calculation
		sinValue.isBetween(undefined, 3).validate(calculateSinus, calculatePythagoras);
	});
}

function calculatePythagoras()
{
	var result = new Runtime.Integer();

	var value = new Runtime.Integer(0);
	value.add(pythValue);
	value.multiplicate(pythValue);
	value.add(value);

	Util.Math.sqrt(value, result, function ()
	{
		Chat.Tellraw.create("Pythagoras: a = b = ", pythValue.toTellrawExtra(), " => c = ", result.toTellrawExtra()).tell(Entities.Selector.AllPlayer);

		//step 5
		pythValue.add(5);

		// from infinite to 30
		pythValue.isBetween(undefined, 30, calculatePythagoras);
	});
}

// TODO cos ...


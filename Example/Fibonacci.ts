/// <reference path="../Core/API.ts"/>

var first = new Runtime.Integer(1);
var second = new Runtime.Integer(1);
var backup = new Runtime.Integer();

var count = new Runtime.Integer(0);

var timer = new Util.Timer(calculateFibonacci, 20);
timer.start();

function calculateFibonacci()
{
	Chat.Tellraw.create(
		"Fibonacci after ",
		count.toTellrawExtra(),
		"-months: ",
		first.toTellrawExtra()
	).tell(new Entities.Player("@a"));
	
	backup.set(first);
	first.add(second);
	second.set(backup);

	count.add(1);
}

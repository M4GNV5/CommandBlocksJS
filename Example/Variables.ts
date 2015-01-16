/// <reference path="../Core/API.ts"/>

var myInt: Runtime.Integer;
callOnce(function ()
{
	myInt = new Runtime.Integer(1);
});
myInt.operation(Scoreboard.MathOperation.multiplication, 2);

var t = new Chat.Tellraw("Current value: ", Chat.Color.red, true);

var extra = myInt.toTellrawExtra();
extra.Color = Chat.Color.gold;
extra.bold = true;
t.extra.push(extra);

t.extra.push(new Chat.Message("\nPro tip: Try pressing the button again!", Chat.Color.green, false, true));

t.tell(new Entities.Selector(Entities.SelectorTarget.AllPlayer));

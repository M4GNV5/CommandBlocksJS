/// <reference path="../Core/API.ts"/>

var myInt = new Runtime.Integer();
callOnce(function () { myInt.set(1); });
myInt.operation(Scoreboard.MathOperation.multiplication, 2);

var t = new Chat.Tellraw();
t.text = "Current value: ";
t.extras.push(myInt.toTellrawExtra());
t.extras.push(new Chat.Message("\nPro tip: try pressing button again!"));
t.tell(new Entities.Selector(Entities.SelectorTarget.AllPlayer));

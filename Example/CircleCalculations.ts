/// <reference path="../Core/API.ts"/>

var radius = new Runtime.Integer(3);

var circumference = new Runtime.Decimal();
var area = new Runtime.Decimal();

var pi = Runtime.Decimal.Pi;

circumference.set(radius);
circumference.multiplicate(pi);
circumference.multiplicate(2);

area.set(radius);
area.multiplicate(area);
area.multiplicate(pi);

var tellraw = new Chat.Tellraw("Radius:           ");
tellraw.extra.push(
	radius.toTellrawExtra(),
	new Chat.Message("\nCircumference: "));

tellraw.extra = tellraw.extra.concat(circumference.toExactTellrawExtra());

tellraw.extra.push(new Chat.Message("\nArea:             "));
tellraw.extra = tellraw.extra.concat(area.toExactTellrawExtra());


tellraw.tell(new Entities.Player("@a"));

/// <reference path="../Core/API.ts"/>

command("gamerule sendCommandFeedback false");

var current = new Runtime.Integer();
var operator = new Runtime.String("X");
var operatorLabel = new Runtime.String();
var first = new Runtime.Integer();

function createNumButton(i: number): Chat.Message
{
	var button = new Chat.Message(i.toString(), Chat.Color.yellow);
	button.clickEvent = new Chat.CallbackClickEvent(function ()
	{
		current.multiplicate(10);
		current.add(i);

		call(drawCalculator);
	});
	return button;
}

var numButtons: Chat.Message[] = []
for (var i = 0; i < 10; i++)
{
	numButtons[i] = createNumButton(i);
}



function createOperatorButton(op: string, label: string): Chat.Message
{
	var button = new Chat.Message(label, Chat.Color.green);
	button.clickEvent = new Chat.CallbackClickEvent(function ()
	{
		operator.set(op);
		operatorLabel.set(label);
		first.set(current);
		current.set(0);

		call(drawCalculator);
	});
	return button;
}

var operatorButtons: { [index: string]: Chat.Message } = {};
operatorButtons["+"] = createOperatorButton("add", "+");
operatorButtons["-"] = createOperatorButton("remove", "-");
operatorButtons["*"] = createOperatorButton("multiplicate", "*");
operatorButtons["/"] = createOperatorButton("divide", "/");
operatorButtons["%"] = createOperatorButton("remainder", "%");
operatorButtons["^"] = createOperatorButton("pow", "^");



var specialButtons: { [index: string]: Chat.Message } = {};

specialButtons["C"] = new Chat.Message("C", Chat.Color.red);
specialButtons["C"].clickEvent = new Chat.CallbackClickEvent(function ()
{
	current.set(0);
	operator.set("X");
	first.set(0);

	call(drawCalculator);
});

specialButtons["CE"] = new Chat.Message("CE", Chat.Color.red);
specialButtons["CE"].clickEvent = new Chat.CallbackClickEvent(function ()
{
	current.set(0);

	call(drawCalculator);
});

specialButtons["="] = new Chat.Message("=", Chat.Color.red);
specialButtons["="].clickEvent = new Chat.CallbackClickEvent(function ()
{
	function applyOperator(op: string)
	{
		first[op](current);
		current.set(first);
		operator.set("X");
		first.set(0);

		call(drawCalculator);
	}

	operator.isExact("add", function () { applyOperator("add"); });
	operator.isExact("remove", function () { applyOperator("remove"); });
	operator.isExact("multiplicate", function () { applyOperator("multiplicate"); });
	operator.isExact("divide", function () { applyOperator("divide"); });

	operator.isExact("remainder", function ()
	{
		first.set(current, Runtime.NumberSetMode.divisionRemainder);
		current.set(first);
		operator.set("X");
		first.set(0);

		call(drawCalculator);
	});

	operator.isExact("pow", function ()
	{
		Chat.Tellraw.create("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nCalculating please wait...").tell(Entities.Selector.AllPlayer);
		Util.Math.pow(first, current, (value) =>
		{
			current.set(value);
			first.set(0);
			operator.set("X");

			call(drawCalculator);
		});
	});
});

function drawCalculator()
{
	var body = [
		specialButtons["CE"], "  ", specialButtons["C"], " ", operatorButtons["/"], "\n",
		numButtons[7], " ", numButtons[8], " ", numButtons[9], " ", operatorButtons["*"], "\n",
		numButtons[4], " ", numButtons[5], " ", numButtons[6], " ", operatorButtons["+"], "\n",
		numButtons[1], " ", numButtons[2], " ", numButtons[3], " ", operatorButtons["-"], "\n",
		numButtons[0], " ", operatorButtons["^"], " ", operatorButtons["%"], " ", specialButtons["="]
	];

	operator.isExact("X").validate(function ()
	{
		Chat.Tellraw.create(
			"Calculator in vanilla Minecraft written in Typescript compiled with CommandblocksJS\n\n\n\n\n\n\n\n\n\n\n\n\n",
			current.toTellrawExtra(), "\n",
			body
			).tell(Entities.Selector.AllPlayer);
	}, function ()
	{
		Chat.Tellraw.create(
			"Calculator in vanilla Minecraft written in Typescript compiled with CommandblocksJS\n\n\n\n\n\n\n\n\n\n\n\n\n",
			first.toTellrawExtra(), " ", operatorLabel.toTellrawExtra(), " ", current.toTellrawExtra(), "\n",
			body
			).tell(Entities.Selector.AllPlayer);
	});
}

call(drawCalculator);

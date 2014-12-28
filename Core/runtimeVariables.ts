//#runtimeVariables.ts

class RuntimeInteger
{
	static score: Score = new Score("std.values", "dummy");
	name: string;

	constructor(startValue: number = 0, name: string = Naming.next("int"))
	{
		this.name = name;

		RuntimeInteger.score.set(this.name, startValue);
	}

	set(value: number): void
	{
		RuntimeInteger.score.set(this.name, value);
	}

	add(value: number): void
	{
		RuntimeInteger.score.add(this.name, value);
	}

	remove(value: number): void
	{
		RuntimeInteger.score.remove(this.name, value);
	}

	reset(): void
	{
		RuntimeInteger.score.reset(this.name);
	}

	test(callback: Function, min: number, max: number): void
	{
		RuntimeInteger.score.test(this.name, callback, min, max);
	}

	operation(operation: string, other: string, otherPlayer: string): void
	{
		RuntimeInteger.score.operation(this.name, operation, otherPlayer, other);
	}

	isExact(value: number, callback?: Function): string
	{
		return this.hasValue(value, callback);
	}

	hasValue(value: number, callback?: Function): string
	{
		return this.isBetween(value, value, callback);
	}

	isBetween(min: number, max: number = min, callback?: Function): string
	{
		var command = "scoreboard players test " + this.name + " " + RuntimeInteger.score.name + " " + min + " " + max;

		if (callback !== undefined)
			validate(command, callback);

		return command;
	}

	asTellrawExtra(): TellrawExtra
	{
		var extra = new TellrawExtra();
		extra.obj =
		{
			score:
			{
				name: this.name,
				objective: RuntimeInteger.score.name
			}
		};

		return extra;
	}
}

class RuntimeBoolean
{
	base: RuntimeInteger = new RuntimeInteger();

	set(value)
	{
		if (value)
			this.base.set(1);
		else
			this.base.set(0);
	}
	hasValue(value, callback)
	{
		if (value)
			return this.base.hasValue(1, callback);
		else
			return this.base.hasValue(0, callback);
	}

	isTrue(callback)
	{
		return this.hasValue(true, callback);
	}
	isFalse(callback)
	{
		return this.hasValue(false, callback);
	}

	asTellrawExtra()
	{
		return this.base.asTellrawExtra();
	}
}

class RuntimeString
{
	static lastIndex: number = 0;
	static indexScore: Score = new Score("std.strings", "dummy");

	selector: Selector;

	constructor(value: string = Naming.next("string"))
	{
		RuntimeString.lastIndex++;
		this.selector = Selector.parse("@e[score_strings_min=" + RuntimeString.lastIndex + ",score_strings=" + RuntimeString.lastIndex + "]");

		callOnce(function ()
		{
			command('summon Chicken ~ ~1 ~ {CustomName:"' + value + '",NoAI:true,Invincible:true}');

			RuntimeString.indexScore.set('@e[name=' + value + ']', RuntimeString.lastIndex);
		});
		delay(4);
	}

	set(value: string)
	{
		command('entitydata ' + this.selector + ' {CustomName:"' + value + '"}');
	}

	hasValue(value: string, callback: Function): Selector
	{
		var hasValueSelector = this.selector.clone();
		hasValueSelector.setAttribute("name", value);

		testfor(hasValueSelector.toString(), callback);

		return hasValueSelector;
	}

	asTellrawExtra(): TellrawExtra
	{
		var extra = new TellrawExtra();
		extra.obj =
		{
			selector: this.selector.toString()
		};

		return extra;
	}
}
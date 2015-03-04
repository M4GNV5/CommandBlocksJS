/// <reference path="../API.ts"/>

module Runtime
{
	export class Boolean implements Variable<boolean>
	{
		static trueValue = 1;
		static falseValue = 0;

		base: Integer;

		constructor(name: string)
		constructor(selector: Entities.Selector)
		constructor(startValue: boolean = false, selector: any = Util.Naming.next("bool"))
		{
			var value = startValue ? 1 : 0;
			this.base = new Integer(value, selector);
		}

		set(value: boolean): void
		{
			if(value)
				this.base.set(1);
			else
				this.base.set(0);
		}

		isExact(value: boolean, callback?: Function): MinecraftCommand
		{
			if (value)
				return this.base.isExact(1, callback);
			else
				return this.base.isExact(0, callback);
		}

		isTrue(callback?: Function): MinecraftCommand
		{
			return this.isExact(true, callback);
		}
		isFalse(callback?: Function): MinecraftCommand
		{
			return this.isExact(false, callback);
		}

		toTellrawExtra(): Chat.TellrawScoreExtra
		{
			return this.base.toTellrawExtra();
		}
	}
}

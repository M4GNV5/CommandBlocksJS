/// <reference path="../API.ts"/>

module Runtime
{
	export class Boolean
	{
		static trueValue = 1;
		static falseValue = 0;

		base: Integer;

		constructor(name: string)
		constructor(selector: Entities.Selector)
		constructor(selector: any = Util.Naming.next("int"))
		{
			this.base = new Integer(selector);
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
	}
}

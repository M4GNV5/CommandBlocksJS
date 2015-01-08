/// <reference path="./../Scoreboard/Team.ts"/>
/// <reference path="SelectorArgument.ts"/>
/// <reference path="SelectorChar.ts"/>

module Entities
{
	export class Selector
	{
		char: SelectorChar;
		private arguments: { [index: string]: any } = {};

		constructor(char: SelectorChar = SelectorChar.e)
		{
			this.char = char;
		}

		setArgument(argument: SelectorArgument, value: EntityType): void
		setArgument(argument: SelectorArgument, value: Scoreboard.Team): void
		setArgument(argument: SelectorArgument, value: number): void
		setArgument(argument: SelectorArgument, value: string): void
		setArgument(argument: SelectorArgument, value: any): void
		{
			this.arguments[argument.identifier] = value;
		}
		getArgument(argument: SelectorArgument): string
		{
			return this.arguments[argument.identifier];
		}
		getArguments(): SelectorArgument[]
		{
			var arg: SelectorArgument[] = [];
			for (var name in this.arguments)
				arg.push(new SelectorArgument(name));
			return arg;
		}

		implement(other: Selector, ignoreConflicts: boolean = true): void
		{
			var otherArgs = other.getArguments();
			for (var i = 0; i < otherArgs.length; i++)
			{
				if (typeof this.arguments[otherArgs[i].identifier] != 'undefined')
				{
					if (ignoreConflicts)
						continue;
					else
						throw "Cannot combine selectors! Both define argument '"+otherArgs[i].identifier+"'";
				}
				var val = other.getArgument(otherArgs[i]);
				this.setArgument(otherArgs[i], val);
			}
		}

		parse(selector: string): Selector
		{
			selector = selector.trim();
			var selectorChar = <SelectorChar>SelectorChar[selector[1]];
			var sel = new Selector(selectorChar);

			var argumentString = selector.substring(3, selector.length - 1);
			var argumentArray = argumentString.split(',');

			for (var i = 0; i < argumentArray.length; i++)
			{
				var argumentSplit = argumentArray[i].split('=');
				var arg = new SelectorArgument(argumentSplit[0]);
				sel.setArgument(arg, argumentSplit[1]);
			}

			return sel;
		}

		toString(): string
		{
			var sel = "@";
			sel += this.char.toString();
			if (Object.keys(this.arguments).length > 0)
			{
				sel += "[";
				for (var name in this.arguments)
				{
					var val: string;
					if (this.arguments[name] instanceof Scoreboard.Team)
						val = (<Scoreboard.Team>this.arguments[name]).name;
					else
						val = this.arguments[name].toString();

					sel += name + "=" + val + ",";
				}
				sel = sel.substr(0, sel.length - 1);
				sel += "]";
			}

			return sel;
		}
	}
}

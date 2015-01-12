/// <reference path="../API.ts"/>

module Entities
{
	export class Selector
	{
		char: SelectorTarget;
		private arguments: SelectorArgument[];

		constructor(char: SelectorTarget = SelectorTarget.AllPlayer)
		{
			this.char = char;
		}

		setArgument(argument: SelectorArgument, invert: boolean = false): void
		{
			for (var i = 0; i < this.arguments.length; i++)
			{
				if (this.arguments[i].identifier == argument.identifier)
					this.arguments[i].setValue(argument.value, invert);
			}
		}

		getArgument(argument: SelectorArgument): SelectorArgument
		{
			for (var i = 0; i < this.arguments.length; i++)
			{
				if (this.arguments[i].identifier == argument.identifier)
					return this.arguments[i];
			}
			return null;
		}

		getArguments(): SelectorArgument[]
		{
			return this.arguments;
		}

		merge(other: Selector, ignoreConflicts: boolean = true): void
		{
			var otherArgs = other.getArguments();
			for (var i = 0; i < otherArgs.length; i++)
			{
				if (this.getArgument(otherArgs[i]) != null)
				{
					if (ignoreConflicts)
						continue;
					else
						throw "Cannot combine selectors! Both define argument '"+otherArgs[i].identifier+"'";
				}
				this.setArgument(otherArgs[i]);
			}
		}

		static parse(selector: string): Selector
		{
			selector = selector.trim();
			assert(selector[0] == "@", "Selector '" + selector + "' does not start with a @");

			var selectorChar = new SelectorTarget(selector[1]);
			var sel = new Selector(selectorChar);

			var argumentString = selector.substring(3, selector.length - 1);
			var argumentArray = argumentString.split(',');

			for (var i = 0; i < argumentArray.length; i++)
			{
				var argumentSplit = argumentArray[i].split('=');
				var arg = SelectorArgument.parse(argumentSplit[0]);
				arg.setRaw(argumentSplit[1]);
				sel.setArgument(arg);
			}

			return sel;
		}

		toString(): string
		{
			var sel = "@";
			sel += this.char.identifier;
			if (Object.keys(this.arguments).length > 0)
			{
				sel += "[";
				for (var name in this.arguments)
				{
					var val: string;
					if (this.arguments[name] instanceof Scoreboard.Team)
						val = this.arguments[name].stringValue;
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
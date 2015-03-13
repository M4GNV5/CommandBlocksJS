/// <reference path="../API.ts"/>

module Entities
{
	export class Selector
	{
		static get AllPlayer()
		{
			return new Entities.Selector(SelectorTarget.AllPlayer);
		}
		static get NearestPlayer()
		{
			return new Entities.Selector(SelectorTarget.NearestPlayer);
		}
		static get RandomEntity()
		{
			return new Entities.Selector(SelectorTarget.RandomPlayer);
		}
		static get Entity()
		{
			return new Entities.Selector(SelectorTarget.Entities);
		}



		char: SelectorTarget;
		private arguments: { [identifier: string]: SelectorArgument } = {};

		constructor(char: SelectorTarget = SelectorTarget.AllPlayer)
		{
			this.char = char;
		}

		setArgument(argument: SelectorArgument): void
		{
			this.arguments[argument.identifier] = argument;
		}

		getArgument(argument: SelectorArgument): SelectorArgument
		{
			return this.arguments[argument.identifier];
		}

		getArguments(): { [identifier: string]: SelectorArgument }
		{
			return this.arguments;
		}

		merge(other: Selector, ignoreConflicts: boolean = true): void
		{
			var otherArgs = other.getArguments();
			for (var arg in otherArgs)
			{
				if (this.getArgument(otherArgs[arg]) != null)
				{
					if (ignoreConflicts)
						continue;
					else
						throw "Cannot combine selectors! Both define argument '" + otherArgs[arg].identifier+"'";
				}
				this.setArgument(otherArgs[arg].clone());
			}
		}

		clone(): Selector
		{
			var other = new Selector(this.char);
			other.merge(this);
			return other;
		}

		static parse(selector: string): Selector
		{
			selector = selector.trim();
			Util.assert(selector[0] == "@", "Selector '" + selector + "' does not start with @");

			var selectorChar = new SelectorTarget(selector[1]);
			var sel = new Selector(selectorChar);

			if (selector.length > 2)
			{
				var argumentString = selector.substring(3, selector.length - 1);
				var argumentArray = argumentString.split(',');

				for (var i = 0; i < argumentArray.length; i++)
				{
					var argumentSplit = argumentArray[i].split('=');
					var arg = SelectorArgument.parse(argumentSplit[0]);
					arg.setRaw(argumentSplit[1]);
					sel.setArgument(arg);
				}
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
					sel += name + "=" + this.arguments[name].stringValue + ",";
				}
				sel = sel.substr(0, sel.length - 1);
				sel += "]";
			}

			return sel;
		}
	}
}

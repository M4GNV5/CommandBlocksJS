module Entities
{
	export class SelectorTarget
	{
		static a = new SelectorTarget("a");
		static e = new SelectorTarget("e");
		static p = new SelectorTarget("p");
		static r = new SelectorTarget("r");

		static AllPlayer = SelectorTarget.a;
		static Entities = SelectorTarget.e;
		static NearestPlayer = SelectorTarget.p;
		static RandomPlayer = SelectorTarget.r;

		identifier: string;

		constructor(identifier: string)
		{
			Util.assert(["a", "e", "p", "r"].indexOf(identifier) != -1, "Invalid identifier!");
			this.identifier = identifier;
		}
	}
}

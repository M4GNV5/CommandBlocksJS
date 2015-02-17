module Block
{
	export class SetBlockHandling
	{
		static Replace: SetBlockHandling = new SetBlockHandling("replace");
		static Destroy: SetBlockHandling = new SetBlockHandling("destroy");
		static Keep: SetBlockHandling = new SetBlockHandling("keep");

		constructor(public str: string)
		{
		}

		toString(): string
		{
			return this.str;
		}
	}
}
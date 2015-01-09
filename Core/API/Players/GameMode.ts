module Players
{
	export class GameMode
	{
		static Survival: GameMode = new GameMode(0, "s", "survival");
		static Creative: GameMode = new GameMode(1, "c", "creative");
		static Adventure: GameMode = new GameMode(2, "a", "adventure");
		static Spectator: GameMode = new GameMode(3, "sp", "spectator");

		constructor(public id: number, public shortStr: string, public longStr: string)
		{
		}

		toNumber(): number
		{
			return this.id;
		}

		toString(): string
		{
			return this.shortStr;
		}

		toLongString(): string
		{
			return this.longStr;
		}
	}
}

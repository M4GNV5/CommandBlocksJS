/// <reference path="./../API.ts"/>

module Chat
{
	export class Tellraw extends Message
	{
		extras: Message[] = [];

		tell(selector: Entities.Selector)
		{
			this.generate(selector).run();
		}
		generate(target: Entities.Selector): MinecraftCommand
		{
			var cmd = "tellraw " + target.toString();

			var src = JSON.stringify(this, (key, value) =>
			{
				if (value instanceof Entities.Selector)
					return value.toString();
				else
					return value;
			});

			return new MinecraftCommand(cmd + " " + src);
		}
	}
}

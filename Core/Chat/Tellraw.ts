/// <reference path="./../API.ts"/>

module Chat
{
	export class Tellraw extends Message
	{
		static create(...args: any[]): Tellraw
		{
			var tellraw = new Tellraw();
			function addToTellraw(obj: any)
			{
				if (obj instanceof Array)
					for (var i = 0; i < obj.length; i++)
						addToTellraw(obj[i]);
				else if (typeof obj == 'string' || typeof obj == 'number' || typeof obj == 'boolean')
					tellraw.extra.push(new Chat.Message(obj.toString()));
				else if (obj instanceof Chat.Message)
					tellraw.extra.push(obj);
				else
					throw "Tellraw.create only accepts Chat.Message, primitives and arrays not '" + obj.constructor.name + "'";
			}

			addToTellraw(args);
			return tellraw;
		}

		extra: Message[] = [];

		tell(selector: Entities.Selector)
		{
			this.generate(selector).run();
		}
		generate(target: Entities.Selector): MinecraftCommand
		{
			var cmd = "tellraw " + target.toString();

			var src = JSON.stringify(this, (key, value) =>
			{
				if (value instanceof CallbackClickEvent)
					(<CallbackClickEvent>value).intialize();

				if (value instanceof Entities.Selector)
					return value.toString();
				else
					return value;
			});

			return new MinecraftCommand(cmd + " " + src);
		}
	}
}

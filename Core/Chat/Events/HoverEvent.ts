/// <reference path="./../../API.ts"/>

module Chat
{
	export class HoverEvent
	{
		static showText(text: string) { return new HoverEvent("show_text", text); }
		static showItem(item: string) { return new HoverEvent("show_item", item); }
		static showAchievement(name: string) { return new HoverEvent("show_achievement", name); }
		static showEntity(entity: string) { return new HoverEvent("show_entity", entity); }

		action: string;
		value: string;

		constructor(action: string, value: string)
		{
			this.action = action;
			this.value = value;
		}
	}
}
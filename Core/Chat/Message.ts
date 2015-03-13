/// <reference path="./../API.ts"/>

module Chat
{
	export class Message
	{
		text: string;
		bold: boolean;
		italic: boolean;
		obfuscated: boolean;
		underlined: boolean;
		strikethrough: boolean;

		private color: string;

		set Color(value: Color)
		{
			this.color = Color[value];
		}
		get Color(): Color
		{
			return Color[this.color];
		}

		clickEvent: ClickEvent;
		hoverEvent: HoverEvent;

		constructor(text: string = "",
			color: Color = Color.white,
			bold: boolean = false,
			italic: boolean = false,
			obfuscated: boolean = false,
			underlined: boolean = false,
			strikethrough: boolean = false,
			clickEvent?: ClickEvent,
			hoverEvent?: HoverEvent
		)
		{
			this.text = text;
			this.Color = color;
			this.bold = bold;
			this.italic = italic;
			this.obfuscated = obfuscated;
			this.underlined = underlined;
			this.strikethrough = strikethrough;

			this.clickEvent = clickEvent;
			this.hoverEvent = hoverEvent;
		}
	}
}

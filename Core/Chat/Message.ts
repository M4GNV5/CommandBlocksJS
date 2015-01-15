/// <reference path="./../API.ts"/>

module Chat
{
	export class Message
	{
		text: string;
		color: Color;
		bold: boolean;
		italic: boolean;
		obfuscated: boolean;
		underlined: boolean;

		//TODO events

		constructor(text: string = "", color: Color = Color.white, bold: boolean = false, italic: boolean = false, obfuscated: boolean = false, underlined: boolean = false)
		{
			this.text = text;
			this.color = color;
			this.bold = bold;
			this.italic = italic;
			this.obfuscated = obfuscated;
			this.underlined = underlined;
		}
	}
}

/// <reference path="./../API.ts"/>

module Chat
{
	export class TellrawSelectorExtra extends Message
	{
		private selector: string;

		constructor(selector: Entities.Selector)
		{
			super();

			this.selector = selector.toString();

			delete this.text;
		}
	}
}

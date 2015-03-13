/// <reference path="./../../API.ts"/>

module Chat
{
	export class ClickEvent extends Runtime.Callback
	{
		static runCommand(cmd: string) { return new ClickEvent("run_command", cmd); }
		static openUrl(url: string) { return new ClickEvent("open_url", url); }
		static changePage(page: number) { return new ClickEvent("change_page", page.toString()); }
		static suggestCommand(cmd: string) { return new ClickEvent("suggest_command", cmd); }

		action: string;
		value: string;

		constructor(action: string, value: string)
		{
			this.action = action;
			this.value = value;

			super();
		}
	}
}

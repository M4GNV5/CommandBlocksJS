/// <reference path="./../API.ts"/>

module Util
{
	export class Event
	{
		private callback: Runtime.Callback;

		constructor()
		{
			this.callback = new Runtime.Callback();
		}

		addListener(listener: Function): void
		{
			this.callback.add(listener);
		}

		removeListener(listener?: Function): void
		{
			if (typeof listener == 'undefined')
				this.callback.removeAll();
			else
				this.callback.remove(listener);
		}

		emit(): void
		{
			this.callback.emit();
		}
	}
}

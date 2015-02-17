/// <reference path="./../API.ts"/>

module Util
{
	export class Timer
	{
		public delay: Runtime.Integer;
		private timerFunc: Function;

		private isRunning: Runtime.Integer;
		public get IsRunning(): MinecraftCommand
		{
			return this.isRunning.isBetween(1);
		}

		constructor(callback: Function, delay: number = 20, start: boolean = false)
		{
			var name = Naming.next("timer");
			this.delay = new Runtime.Integer(delay, name);
			this.isRunning = new Runtime.Integer(0, name + "Running");

			var that = this;
			this.timerFunc = function ()
			{
				callback();

				that.isRunning.isBetween(1, undefined, function ()
				{
					setTimeout(that.timerFunc, that.delay);
				});
			}

			if (start)
				this.start();
		}

		start()
		{
			this.isRunning.set(1);
			this.IsRunning.validate(this.timerFunc);
		}

		stop()
		{
			this.isRunning.set(0);
		}

		setDelay(value: number): void
		setDelay(value: Number): void
		setDelay(value: any): void
		{
			this.delay.set(value);
		}

		getDelay(): Runtime.Integer
		{
			return this.delay.clone();
		}
	}
}

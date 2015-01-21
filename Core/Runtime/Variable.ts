/// <reference path="../API.ts"/>

module Runtime
{
	export interface Variable<T>
	{
		set(value: T): void;
		isExact(value: T, callback?: Function): MinecraftCommand;
		toTellrawExtra(): Chat.Message;
	}
}

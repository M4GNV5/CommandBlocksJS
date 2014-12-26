enum EventTypes
{
	Move, Crouch, Swim, Sprint, Death, Kill, EntityKill
}

class EventHandler
{
	static events: { name: Function }[] = [];

	static on(name, func: Function): void
	{
		this.events.push({ name: func });
	}

	static emit(name, ...args: any[]): void
	{
		this.events.filter(x => x.name === name).forEach(x => x.name(args));
	}
}
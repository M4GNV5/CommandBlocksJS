module Scoreboard
{
	export class ObjectiveType
	{
		static dummy = new ObjectiveType("dummy");
		static trigger = new ObjectiveType("trigger");
		static deathCount = new ObjectiveType("deathCount");
		static playerKillCount = new ObjectiveType("playerKillCount");
		static totalKillCount = new ObjectiveType("totalKillCount");
		static health = new ObjectiveType("health");

		static killEntity(entity: Entities.EntityType): ObjectiveType
		{
			return new ObjectiveType("stat.killEntity." + entity.name);
		}
		static entityKilledBy(entity: Entities.EntityType): ObjectiveType
		{
			return new ObjectiveType("stat.entityKilledBy." + entity.name);
		}
		//TODO add all

		value: string;
		constructor(value: string)
		{
			this.value = value;
		}
	}
}

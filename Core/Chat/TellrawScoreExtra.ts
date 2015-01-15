/// <reference path="./../API.ts"/>

module Chat
{
	export class TellrawScoreExtra extends Message
	{
		private objective: string;
		private name: string;

		constructor(objective: Scoreboard.Objective, player: Entities.Selector)
		{
			super();

			this.objective = objective.name;
			this.name = player.toString();
		}
	}
}

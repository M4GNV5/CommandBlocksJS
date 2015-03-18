/// <reference path="./../API.ts"/>

module Chat
{
	export class TellrawScoreExtra extends Message
	{
		private score: { [index: string]: string };

		constructor(objective: Scoreboard.Objective, player: Entities.Selector)
		{
			super();

			this.score = {};
			this.score["objective"] = objective.name;
			this.score["name"] = player.toString();

			delete this.text;
		}
	}
}

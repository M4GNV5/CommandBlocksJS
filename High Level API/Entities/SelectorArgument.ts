/// <reference path="./../Scoreboard/Objective.ts"/>
/// <reference path="./../Scoreboard/Team.ts"/>

module Entities
{
	export class SelectorArgument
	{
		identifier: string;
		constructor(identifier: string)
		{
			this.identifier = identifier;
		}

		static positionX = new SelectorArgument("x");
		static positionY = new SelectorArgument("y");
		static positionZ = new SelectorArgument("z");
		static radiusMax = new SelectorArgument("r");
		static radiusMin = new SelectorArgument("rm");
		static gamemode = new SelectorArgument("m");
		static count = new SelectorArgument("c");
		static levelMax = new SelectorArgument("l");
		static levelMin = new SelectorArgument("lm");
		static team = new SelectorArgument("team");
		static name = new SelectorArgument("name");
		static volumeDimensionX = new SelectorArgument("dx");
		static volumeDimensionY = new SelectorArgument("dy");
		static volumeDimensionZ = new SelectorArgument("dz");
		static rotationXMax = new SelectorArgument("rx");
		static rotationXMin = new SelectorArgument("rxm");
		static rotationYMax = new SelectorArgument("ry");
		static rotationYMin = new SelectorArgument("rym");
		static entityType = new SelectorArgument("type");

		static scoreMin(objective: Scoreboard.Objective)
		{
			return new SelectorArgument("score_" + objective.name + "_min");
		}
		static scoreMax(objective: Scoreboard.Objective)
		{
			return new SelectorArgument("score_" + objective.name);
		}
	}
}

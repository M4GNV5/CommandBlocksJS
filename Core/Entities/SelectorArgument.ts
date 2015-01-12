/// <reference path="../API.ts"/>

module Entities
{
	export class SelectorArgument
	{
		identifier: string;
		stringValue: string;
		value: any;

		private type: string;
		private typeConverter: (any) => string;

		constructor(identifier: string, type: string = "string", typeConverter: (any) => string = (a) => { return <string>a; })
		{
			this.identifier = identifier;
			this.type = type;
			this.typeConverter = typeConverter;
		}

		setValue(value: any, invert: boolean = false)
		{
			assert(typeof value == this.type);
			assert((!invert) || (["team", "name", "type"].indexOf(this.identifier) != -1));
			this.stringValue = (invert ? "!" : "") + this.typeConverter(value);
			this.value = value;
		}

		setRaw(value: string)
		{
			this.stringValue = value;
			this.value = value;
		}

		static positionX() { return new SelectorArgument("x", "number", (x) => { return x.toString(); }); }
		static positionY() { return new SelectorArgument("y", "number", (y) => { return y.toString(); }); }
		static positionZ() { return new SelectorArgument("z", "number", (z) => { return z.toString(); }); }

		static radiusMax() { return new SelectorArgument("r", "number", (r) => { return r.toString(); }); }
		static radiusMin() { return new SelectorArgument("rm", "number", (rm) => { return rm.toString(); }); }

		static gamemode() { return new SelectorArgument("m", "object", (m) => { assert(m instanceof Players.GameMode); return (<Players.GameMode>m).toNumber().toString(); }); }

		static count() { return new SelectorArgument("c", "number", (c) => { return c.toString(); }); }

		static levelMax() { return new SelectorArgument("l", "number", (l) => { return l.toString(); }); }
		static levelMin() { return new SelectorArgument("lm", "number", (lm) => { return lm.toString(); }); }

		static team() { return new SelectorArgument("team", "object", (team) => { assert(team instanceof Scoreboard.Team); return (<Scoreboard.Team>team).name; }); }

		static name() { return new SelectorArgument("name", "string"); }

		static diameterX() { return new SelectorArgument("dx", "number", (dx) => { return dx.toString(); }); }
		static diameterY() { return new SelectorArgument("dy", "number", (dy) => { return dy.toString(); }); }
		static diameterZ() { return new SelectorArgument("dz", "number", (dz) => { return dz.toString(); }); }

		static rotationXMax() { return new SelectorArgument("rx", "number", (rx) => { return rx.toString(); }); }
		static rotationXMin() { return new SelectorArgument("rxm", "number", (rxm) => { return rxm.toString(); }); }

		static rotationYMax() { return new SelectorArgument("ry", "number", (ry) => { return ry.toString(); }); }
		static rotationYMin() { return new SelectorArgument("rym", "number", (rym) => { return rym.toString(); }); }

		static entityType() { return new SelectorArgument("type", "object", (type) => { assert(type instanceof EntityType); return (<EntityType>type).name; }); }

		static scoreMin(objective: Scoreboard.Objective) { return new SelectorArgument("score_" + objective.name + "_min", "number", (dx) => { return dx.toString(); }); }

		static scoreMax(objective: Scoreboard.Objective) { return new SelectorArgument("score_" + objective.name, "number", (dx) => { return dx.toString(); }); }

		static parse(name: string): SelectorArgument
		{
			switch (name)
			{
				case "x": return SelectorArgument.positionX();
				case "y": return SelectorArgument.positionY();
				case "z": return SelectorArgument.positionZ();

				case "r": return SelectorArgument.radiusMax();
				case "rm": return SelectorArgument.radiusMin();

				case "m": return SelectorArgument.gamemode();

				case "c": return SelectorArgument.count();

				case "l": return SelectorArgument.levelMax();
				case "lm": return SelectorArgument.levelMin();

				case "team": return SelectorArgument.team();

				case "name": return SelectorArgument.name();

				case "dx": return SelectorArgument.diameterX();
				case "dy": return SelectorArgument.diameterY();
				case "dz": return SelectorArgument.diameterZ();

				case "rx": return SelectorArgument.rotationXMax();
				case "rxm": return SelectorArgument.rotationXMin();

				case "ry": return SelectorArgument.rotationYMax();
				case "rym": return SelectorArgument.rotationYMin();

				case "type": return SelectorArgument.entityType();
				default:
					if (name.indexOf("score_") == 0)
					{
						if (name.indexOf("_min") != -1)
						{
							return new SelectorArgument(name, "number", (dx) => { return dx.toString(); });
						}
						else
						{
							return new SelectorArgument(name, "number", (dx) => { return dx.toString(); });
						}
					}
					assert(false, "Unknown Selector name: " + name);
			}
		}
	}
}

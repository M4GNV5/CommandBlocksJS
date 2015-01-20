/// <reference path="API.ts"/>

/**
 * Start position of structure.
 */
declare var startPosition: Util.Vector3;

/**
 * Core class for generating world/schematic.
 */
class OutputParser
{
	/** Current position. */
	static position;
	/** Current direction. */
	static direction: number = 1;

	/** Minecraft positions of function beginning. */
	static functionPositions = {};

	/**
	 * Converts all serialized functions to a world/schematic.
	 */
	static start(): void
	{
		this.position = startPosition;
		var functions = outputHandler.output;

		for (var i = 0; i < functions.length; i++)
		{
			this.functionPositions[i] = this.position.clone();

			var sidewards = this.getMaxSidewards(functions[i]);

			this.updatePosition(
				function () { OutputParser.position.z -= sidewards },
				function () { OutputParser.position.z += sidewards },
				function () { OutputParser.position.z -= sidewards },
				function () { OutputParser.position.z += sidewards }
				);
		}

		for (var i = 0; i < functions.length; i++)
		{
			var source = functions[i];
			this.position = this.functionPositions[i].clone();
			this.parseFunction(source);
		}

		api.save();
	}

	/**
	 * Gets the count the function goes sidewards.
	 * @param source Serialized function.
	 */
	static getMaxSidewards(source: string): number
	{
		var sidewards = 2;
		var splitted = source.split(';');
		for (var i = 0; i < splitted.length; i++)
		{
			var splittedCall = splitted[i].split('|');
			if (splittedCall.length > sidewards)
			{
				sidewards = splittedCall.length;
			}
		}
		return sidewards;
	}

	/**
	 * Parses a serialized function.
	 */
	static parseFunction(source: string): void
	{
		if (source == '')
			return;

		var calls = source.split(';');

		for (var i = 0; i < calls.length; i++)
		{
			var _call = calls[i].trim();

			if (_call == '')
				continue;

			this.parseCall(_call);

			this.updatePosition(
				function () { OutputParser.position.x-- },
				function () { OutputParser.position.x++ },
				function () { OutputParser.position.z-- },
				function () { OutputParser.position.z++ }
				);
		}
	}

	/**
	 * Parses a serialized function step.
	 */
	static parseCall(source: string): void
	{
		if (source.length < 1)
			return;

		switch (source[0])
		{
			case 'c': //c for C ommandblock
				var command = source.substring(1);
				api.placeCommandBlock(command, this.position.x, this.position.y, this.position.z);
				break;
			case 'q': //q for Q uery command
				var qCommand = source.substring(1);

				api.placeCommandBlock(qCommand, this.position.x, this.position.y, this.position.z);

				var torchPos = new Util.Vector3(this.position.x, this.position.y + 1, this.position.z);
				api.placeBlock(75, 5, torchPos.x, torchPos.y, torchPos.z);

				var resetCbPos = new Util.Vector3(this.position.x, this.position.y + 2, this.position.z);
				var escapedCommand = qCommand.replace("\"", "\\\"");
				var resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".replace("%cmd%", escapedCommand);
				api.placeCommandBlock(resetCommand, resetCbPos.x, resetCbPos.y, resetCbPos.z);
				break;
			case 'b': //b for B lock
				var blockInfo = source.substring(1).split('_');
				api.placeBlock(parseInt(blockInfo[0]), parseInt(blockInfo[1]), this.position.x, this.position.y, this.position.z);
				break;
			case 's': //s for S idewards
				var calls = source.substring(1).split('|');

				var oldPos = this.position.clone();
				direction++;
				for (var i = 0; i < calls.length; i++)
				{
					this.parseCall(calls[i].trim());
					this.updatePosition(
						function () { OutputParser.position.x-- },
						function () { OutputParser.position.x++ },
						function () { OutputParser.position.z-- },
						function () { OutputParser.position.z++ }
						);
				}
				direction--;
				this.position = oldPos;
				break;
			case 'e': //e for E xecute
				var ePosition = this.functionPositions[source.substring(1)];

				var offX = ePosition.x - this.position.x;
				var offY = ePosition.y - this.position.y - 1;
				var offZ = ePosition.z - this.position.z;

				var other = outputHandler.output[source.substring(1)];
				var offX2 = ePosition.x - this.position.x + other.split(';').length - 2;

				var eCommand = "fill ~" + offX + " ~" + offY + " ~" + offZ + " ~" + offX2 + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace";

				api.placeCommandBlock(eCommand, this.position.x, this.position.y, this.position.z);
				break;
			case 'n': //n for N ote (sign)
				var lines = source.substring(1).split('_');
				var signDirection = lines[lines.length - 1];
				lines[lines.length - 1] = '';
				api.placeSign(lines, parseInt(signDirection), this.position.x, this.position.y, this.position.z);
				break;
			default:
				api.log("Unknown Source: '" + source + "'");
				break;
		}
	}

	/**
	 * Moves the current cursor position.
	 */
	static updatePosition(xMinus: Function, xPlus: Function, zMinus: Function, zPlus: Function): void
	{
		switch (direction)
		{
			case 0:
				zMinus();
				break;
			case 1:
				xPlus();
				break;
			case 2:
				zPlus();
				break;
			case 3:
				xMinus();
				break;
		}
	}
}
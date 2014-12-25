var OutputParser = function()
{
	var position;
	var direction = 1;

	var functionPositions = {};

	this.start = function()
	{
		position = startPosition;
		var functions = OutputHandler.output;

		var zMinusSidewards = function() { position.z -= sidewards; };
		var zPlusSidewards = function() { position.z += sidewards; };

		var i;

		for (i = 0; i < functions.length; i++)
		{
			functionPositions[i] = position.clone();

			var sidewards = getMaxSidewards(functions[i]);

			updatePosition(zMinusSidewards, zPlusSidewards,zMinusSidewards, zPlusSidewards);
		}

		for (i = 0; i < functions.length; i++)
		{
			var source = functions[i];
			position = functionPositions[i].clone();
			parseFunction(source);
		}

		api.save();
	};
	function getMaxSidewards(source)
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

	function parseFunction(source)
	{
		if (source === '')
			return;

		var calls = source.split(';');

		var a = function() { position.x--; };
		var b = function() { position.x++; };
		var c = function() { position.z--; };
		var d = function() { position.z++; };

		for (var i = 0; i < calls.length; i++)
		{
			var _call = calls[i].trim();

			if (_call === '')
				continue;

			parseCall(_call);

			updatePosition(a, b, c, d);
		}
	}

	function parseCall(source)
	{
		if (source.length < 1)
			return;

		switch (source[0])
		{
			case 'c': //c for C ommandblock
				var command = source.substring(1);
				api.placeCommandBlock(command, position.x, position.y, position.z);
				break;
			case 'q': //q for Q uery command
				var qCommand = source.substring(1);

				api.placeCommandBlock(qCommand, position.x, position.y, position.z);

				var torchPos = new Vector3(position.x, position.y + 1, position.z);
				api.placeBlock(75, 5, torchPos.x, torchPos.y, torchPos.z);

				var resetCbPos = new Vector3(position.x, position.y + 2, position.z);
				var escapedCommand = qCommand.replace("\"", "\\\"");
				var resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".replace("%cmd%", escapedCommand);
				api.placeCommandBlock(resetCommand, resetCbPos.x, resetCbPos.y, resetCbPos.z);
				break;
			case 'b': //b for B lock
				var blockInfo = source.substring(1).split('_');
				api.placeBlock(blockInfo[0], blockInfo[1], position.x, position.y, position.z);
				break;
			case 's': //s for S idewards
				var calls = source.substring(1).split('|');

				var a = function() { position.x--; };
				var b = function() { position.x++; };
				var c = function() { position.z--; };
				var d = function() { position.z++; };

				var oldPos = position.clone();
				direction++;
				for (var i = 0; i < calls.length; i++)
				{
					parseCall(calls[i].trim());

					updatePosition(a, b, c, d);
				}
				direction--;
				position = oldPos;
				break;
			case 'e': //e for E xecute
				var ePosition = functionPositions[source.substring(1)];

				var offX = ePosition.x - position.x;
				var offY = ePosition.y - position.y;
				var offZ = ePosition.z - position.z;

				var eCommand = "setblock ~" + offX + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace";

				api.placeCommandBlock(eCommand, position.x, position.y, position.z);
				break;
			case 'n': //n for N ote (sign)
				var lines = source.substring(1).split('_');
				var signDirection = lines[lines.length - 1];
				lines[lines.length - 1] = '';
				api.placeSign(lines, signDirection, position.x, position.y, position.z);
				break;
			default:
				api.log("Unknown Source: '" + source + "'");
				break;
		}
	}

	function updatePosition(xMinus, xPlus, zMinus, zPlus)
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
};

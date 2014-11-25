var OutputParser = new function()
{
	var position;
	var direction = 1;

	var functionPositions = {};

	this.start = function()
	{
		position = startPosition;
		var functions = OutputHandler.output;

		for(var i = 0; i < functions.length; i++)
		{
			functionPositions[i] = position.clone();

			var sidewards = getMaxSidewards(functions[i]);

			updatePosition(function() {position.z -= sidewards}, function() {position.z += sidewards}, function() {position.z -= sidewards}, function() {position.z += sidewards});
		}

		for (var i = 0; i < functions.length; i++)
		{
			var source = functions[i];
			position = functionPositions[i].clone();
			parseFunction(source);
		}
		api.saveWorld();
	}
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
		if (source == '')
			return;

		var calls = source.split(';');

		for (var i = 0; i < calls.length; i++)
		{
			var _call = calls[i].trim();

			if (_call == '')
				continue;

			parseCall(_call);

			updatePosition(function() {position.x--}, function() {position.x++}, function() {position.z--}, function() {position.z++});
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
				api.placeBlock(blockInfo [0], blockInfo [1], position.x, position.y, position.z);
			break;
			case 's': //s for S idewards
				var calls = source.substring(1).split('|');

				var oldPos = position.clone();
				direction++;
				for(var i = 0; i < calls.length; i++)
				{
					parseCall(calls[i].trim());
					updatePosition(function() {position.x--}, function() {position.x++}, function() {position.z--}, function() {position.z++});
				}
				direction--;
				position = oldPos;
			break;
			case 'e': //e for E xecute
				var ePosition = functionPositions [source.substring(1)];

				var eCommand = "setblock " + ePosition + " minecraft:redstone_block 0 replace";

				api.placeCommandBlock(eCommand, position.x, position.y, position.z);
			break;
			case 'n': //n for N ote (sign)
				var lines = source.substring(1).split('_');
				var signDirection = lines[lines.length-1];
				lines[lines.length-1] = '';
				api.placeSign(lines, signDirection, position.x, position.y, position.z);
			break;
			default:
				api.log("Unknown Source: '"+source+"'");
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
}
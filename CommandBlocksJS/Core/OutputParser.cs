using System;
using System.IO;
using System.Collections.Generic;

namespace CommandBlocksJS.Core
{
	public class OutputParser
	{
		private readonly IWorldHandler worldHandler;
		private IntVector3 position;
		private MinecraftDirection direction;

		private Dictionary<string, IntVector3> functionPositions;

		public OutputParser (IWorldHandler worldHandler)
		{
			this.worldHandler = worldHandler;

			this.direction = MinecraftDirection.xPlus;
		}

		public void ParseOutput(ScriptOutput output, IntVector3 position = default(IntVector3))
		{
			this.position = position;
			
			this.functionPositions = new Dictionary<string, IntVector3> ();

			Dictionary<string, string> functions = output.Functions;

			foreach (string function in functions.Keys)
			{
				functionPositions.Add(function, position);

				int sidewards = GetMaxSidewards(functions[function]);

				UpdatePosition(() => position.z -= sidewards, () => position.z += sidewards, () => position.z -= sidewards, () => position.z += sidewards);
			}

			foreach (string function in functions.Keys)
			{
				string source = functions [function];
				this.position = functionPositions [function];
				ParseFunction(source);
			}
			worldHandler.Save();
		}
		public int GetMaxSidewards(string source)
		{
			int sidewards = 2;
			foreach (string call in source.Split(';'))
			{
				string[] splittedCall = call.Split('|');
				if (splittedCall.Length > sidewards)
				{
					sidewards = splittedCall.Length;
				}
			}
			return sidewards;
		}

		private void ParseFunction(string source)
		{
			if (string.IsNullOrEmpty(source))
				return;

			string[] calls = source.Split(';');

			foreach (string call in calls)
			{
				string _call = call.Trim();

				if (string.IsNullOrEmpty(_call))
					continue;

				ParseCall(call);

				UpdatePosition(() => position.x--, () => position.x++, () => position.z--, () => position.z++);
			}
		}

		private void ParseCall(string source)
		{
			if (source.Length < 1)
				return;

			switch (source[0])
			{
				case 'c': //c for C ommandblock
					string command = source.Substring(1);
					worldHandler.PlaceCommandBlock(command, position);
				break;
				case 'q': //q for Q uery command
					string qCommand = source.Substring(1);

					worldHandler.PlaceCommandBlock(qCommand, position);

					IntVector3 torchPos = new IntVector3 (position.x, position.y + 1, position.z);
					worldHandler.PlaceBlock(75, 5, torchPos);

					IntVector3 resetCbPos = new IntVector3 (position.x, position.y + 2, position.z);
					string escapedCommand = qCommand.Replace("\"", "\\\"");
					string resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".Replace("%cmd%", escapedCommand);
					worldHandler.PlaceCommandBlock(resetCommand, resetCbPos);
				break;
				case 'b': //b for B lock
					string[] blockInfo = source.Substring(1).Split('_');
					int id = Convert.ToInt32(blockInfo [0]); //unsafe
					int data = Convert.ToInt32(blockInfo [1]); //unsafe
					worldHandler.PlaceBlock(id, data, position);
				break;
				case 's': //s for S idewards
					string[] calls = source.Substring(1).Split('|');

					IntVector3 oldPos = position;
					direction++;
					foreach (string call in calls)
					{
						ParseCall(call.Trim());
						UpdatePosition(() => position.x--, () => position.x++, () => position.z--, () => position.z++);
					}
					direction--;
					position = oldPos;
				break;
				case 'e': //e for E xecute
					IntVector3 ePosition = functionPositions [source.Substring(1)];

					string eCommand = "setblock " + ePosition.x + " " + ePosition.y + " " + ePosition.z + " minecraft:redstone_block 0 replace";

					worldHandler.PlaceCommandBlock(eCommand, position);
				break;
			}
		}



		private void UpdatePosition(Action xMinus, Action xPlus, Action zMinus, Action zPlus)
		{
			switch (direction)
			{
				case MinecraftDirection.xMinus:
					xMinus();
				break;
				case MinecraftDirection.xPlus:
					xPlus();
				break;
				case MinecraftDirection.zMinus:
					zMinus();
				break;
				case MinecraftDirection.zPlus:
					zPlus();
				break;
			}
		}
	}
}

using System;
using System.IO;
using System.Collections.Generic;

using Substrate;
using Substrate.Core;
using Substrate.TileEntities;

namespace CommandBlocksJS
{
	public class JsOutputParser
	{
		private readonly AnvilWorld world;
		private readonly IBlockManager blockManager;
		private IntVector3 position;
		private MinecraftDirection direction;

		private Dictionary<string, IntVector3> filePositions;

		public JsOutputParser (string worldDirectory, IntVector3 position, MinecraftDirection direction)
		{
			if (!Directory.Exists(worldDirectory))
				throw new System.IO.DirectoryNotFoundException ("The given world was not found!");

			this.world = AnvilWorld.Create(worldDirectory);
			this.blockManager = world.GetBlockManager();
			this.position = position;
			this.direction = direction;

			this.filePositions = new Dictionary<string, IntVector3> ();
		}

		public void ParseDirectory(string directory)
		{
			if (!Directory.Exists(directory))
				throw new System.IO.DirectoryNotFoundException ();
				
			Dictionary<string, string> files = new Dictionary<string, string> ();

			foreach (string file in Directory.GetFiles(directory))
			{
				string content = File.ReadAllText(file);
				files.Add(file, content);

				string name = Path.GetFileNameWithoutExtension(file);
				filePositions.Add(name, position);

				int sidewards = GetMaxSidewards(content);

				UpdatePosition(() => position.z -= sidewards, () => position.z += sidewards, () => position.z -= sidewards, () => position.z += sidewards);
			}

			foreach (string file in files.Keys)
			{
				string source = files [file];
				string name = Path.GetFileNameWithoutExtension(file);
				position = filePositions [name];
				ParseFile(source);
			}
			world.Save();
		}
		public int GetMaxSidewards(string source)
		{
			int sidewards = 2;
			foreach (string call in source.Split(';'))
			{
				string[] splittedCall = call.Split('|');
				if (splittedCall.Length + 1 > sidewards)
				{
					sidewards = splittedCall.Length + 1;
				}
			}
			return sidewards;
		}

		private void ParseFile(string source)
		{
			if (string.IsNullOrEmpty(source))
				return;

			foreach (string call in source.Split(';'))
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
				case 'w': //w for redstone W ire
					PlaceBlock(BlockType.REDSTONE_WIRE, 0);
				break;
				case 't': //t for redstone T orch
					int torchDirection = ((int)direction == 4) ? (int)direction++ : 1;
					PlaceBlock(BlockType.REDSTONE_TORCH_OFF, torchDirection);
				break;
				case 'r': //r for redstone R epeater
					int delay;
					int blockData = (int)direction;
					if (int.TryParse(source.Substring(1), out delay))
						blockData = delay * 4 + blockData;
					PlaceBlock(BlockType.REDSTONE_REPEATER_ON, blockData); //ids changed 93 is now off and 94 on
				break;
				case 'o': //o for analog O utput (comparator)
					PlaceBlock(BlockType.REDSTONE_COMPARATOR_INACTIVE, direction);
				break;
				case 'c': //c for C ommandblock
					string command = source.Substring(1);
					PlaceCommandBlock(command);
				break;
				case 'q': //q for Q uery command
					string qCommand = source.Substring(1);

					PlaceCommandBlock(qCommand);

					IntVector3 torchPos = new IntVector3 (position.x, position.y + 1, position.z);
					PlaceBlock(BlockType.REDSTONE_TORCH_OFF, 5, torchPos);

					IntVector3 resetCbPos = new IntVector3 (position.x, position.y + 2, position.z);
					string escapedCommand = qCommand.Replace("\"", "\\\"");
					string resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".Replace("%cmd%", escapedCommand);
					PlaceCommandBlock(resetCommand, resetCbPos);
				break;
				case 'b': //b for B lock
					string[] blockInfo = source.Substring(1).Split('_');
					int id = Convert.ToInt32(blockInfo [0]); //unsafe
					int data = Convert.ToInt32(blockInfo [1]); //unsafe
					PlaceBlock(id, data);
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
					IntVector3 ePosition = filePositions [source.Substring(1)];

					string eCommand = "setblock " + ePosition.x + " " + ePosition.y + " " + ePosition.z + " minecraft:redstone_block 0 replace";

					PlaceCommandBlock(eCommand);
				break;
			}
		}

		private void PlaceBlock(int id, MinecraftDirection direction)
		{
			PlaceBlock(id, (int)direction);
		}
		private void PlaceBlock(int id, int data)
		{
			int blockBelow = blockManager.GetID(position.x, position.y - 1, position.z);
			if (blockBelow == BlockType.AIR
			   || blockBelow == BlockType.WATER
			   || blockBelow == BlockType.STATIONARY_WATER
			   || blockBelow == BlockType.LAVA
			   || blockBelow == BlockType.STATIONARY_LAVA)
			{
				blockManager.SetID(position.x, position.y - 1, position.z, BlockType.STONE);
				blockManager.SetData(position.x, position.y - 1, position.z, 0);
			}

			PlaceBlock(id, data, position);
		}
		private void PlaceBlock(int id, int data, IntVector3 pos)
		{
			blockManager.SetID(pos.x, pos.y, pos.z, id);
			blockManager.SetData(pos.x, pos.y, pos.z, data);
		}

		private void PlaceCommandBlock(string command)
		{
			int blockBelow = blockManager.GetID(position.x, position.y - 1, position.z);
			if (blockBelow == BlockType.AIR
				|| blockBelow == BlockType.WATER
				|| blockBelow == BlockType.STATIONARY_WATER
				|| blockBelow == BlockType.LAVA
				|| blockBelow == BlockType.STATIONARY_LAVA)
			{
				blockManager.SetID(position.x, position.y - 1, position.z, BlockType.STONE);
				blockManager.SetData(position.x, position.y - 1, position.z, 0);
			}

			PlaceCommandBlock(command, position);
		}
		private void PlaceCommandBlock(string command, IntVector3 pos)
		{
			AlphaBlock cblock = new AlphaBlock (BlockType.COMMAND_BLOCK);
			TileEntityControl te = cblock.GetTileEntity() as TileEntityControl; //unsafe
			te.Command = command;
			blockManager.SetBlock(pos.x, pos.y, pos.z, cblock);
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

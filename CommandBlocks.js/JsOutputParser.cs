﻿using System;
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
		private int sidewards = 2;

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
				
			string[] files = Directory.GetFiles(directory);
			foreach (string file in files)
			{
				string name = Path.GetFileNameWithoutExtension(file);
				filePositions.Add(name, position);
				UpdatePosition(() => position.X += sidewards, () => position.X -= sidewards, () => position.Z += sidewards, () => position.Z -= sidewards);
			}

			foreach (string file in files)
			{
				string source = File.ReadAllText(file).Trim();
				string name = Path.GetFileNameWithoutExtension(file);
				position = filePositions [name];
				ParseFile(source);
			}
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

				UpdatePosition(() => position.X--, () => position.X++, () => position.Z--, () => position.Z++);
			}
		}

		private void ParseCall(string source)
		{
			switch (source[0])
			{
				case 'w': //w for redstone W ire
					PlaceBlock(55, 0);
				break;
				case 't': //t for redstone T orch
					int torchDirection = ((int)direction == 4) ? (int)direction++ : 1;
					PlaceBlock(75, torchDirection);
				break;
				case 'r': //r for redstone R epeater
					PlaceBlock(93, direction);
				break;
				case 'o': //o for analog O utput (comparator)
					PlaceBlock(149, direction);
				break;
				case 'c': //c for C ommandblock
					AlphaBlock cblock = new AlphaBlock (137);
					TileEntityControl te = cblock.GetTileEntity() as TileEntityControl; //unsafe
					te.Command = source.Substring(1);
					blockManager.SetBlock(position.X, position.Y, position.Z, cblock);
				break;
				case 'b': //b for B lock
					string[] blockInfo = source.Substring(1).Split(':');
					int id = Convert.ToInt32(blockInfo [0]); //unsafe
					int data = Convert.ToInt32(blockInfo [1]); //unsafe
					PlaceBlock(id, data);
				break;
				case 's': //s for S idewards
					string[] calls = source.Substring(1).Split(':');
					if (calls.Length + 2 > sidewards)
						sidewards = calls.Length + 2;

					foreach (string call in calls)
					{
						ParseCall(call.Trim());
						UpdatePosition(() => position.Z++, () => position.Z--, () => position.X++, () => position.X--);
					}
				break;
				case 'e': //e for E xecute
					AlphaBlock _cblock = new AlphaBlock (137);
					TileEntityControl _te = _cblock.GetTileEntity() as TileEntityControl; //unsafe
					IntVector3 ePosition = filePositions [source.Substring(1)];
					_te.Command = "setblock " + ePosition.X + " " + ePosition.Y + " " + ePosition.Z + " minecraft:redstone_block replace";
					blockManager.SetBlock(position.X, position.Y, position.Z, _cblock);
				break;
			}
		}

		private void PlaceBlock(int id, MinecraftDirection direction)
		{
			PlaceBlock(id, (int)direction);
		}
		private void PlaceBlock(int id, int data)
		{
			blockManager.SetID(position.X, position.Y, position.Z, id);
			blockManager.SetData(position.X, position.Y, position.Z, data);
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

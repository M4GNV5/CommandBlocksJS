using System;
using System.IO;

using Substrate;
using Substrate.Core;
using Substrate.TileEntities;

namespace CommandBlocksJS
{
	public class Interpreter
	{
		private readonly AnvilWorld world;
		private readonly IBlockManager blockManager;
		private IntVector3 position;
		private MinecraftDirection direction;
		private int sidewards = 2;

		public Interpreter (string path, IntVector3 position, MinecraftDirection direction)
		{
			this.world = AnvilWorld.Create(path);
			this.blockManager = world.GetBlockManager();
			this.position = position;
			this.direction = direction;
		}

		public void Interprete(string folder)
		{
			foreach (string file in Directory.GetFiles(folder))
			{
				string source = File.ReadAllText(file).Trim();
				InterpreteFunction(source);
				UpdatePosition(() => position.X += sidewards, () => position.X -= sidewards, () => position.Z += sidewards, () => position.Z -= sidewards);
			}
		}

		private void InterpreteFunction(string source)
		{
			if (string.IsNullOrEmpty(source))
				return;

			foreach (string call in source.Split(';'))
			{
				call = call.Trim();
				if (string.IsNullOrEmpty(call))
					continue;
				InterpreteCall(call);

				UpdatePosition(() => position.X--, () => position.X++, () => position.Z--, () => position.Z++);
			}
		}

		private void InterpreteCall(string source)
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
						InterpreteCall(call.Trim());
						UpdatePosition(() => position.Z++, () => position.Z--, () => position.X++, () => position.X--);
					}
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

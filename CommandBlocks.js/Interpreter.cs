using System;
using System.IO;

using Substrate;
using Substrate.TileEntities;

namespace CommandBlocksJS
{
	public class Interpreter
	{
		private readonly AnvilWorld world;
		private IntVector3 position;
		private MinecraftDirection direction;
		private int sidewards = 2;

		public Interpreter (string path, IntVector3 position, MinecraftDirection direction)
		{
			this.world = AnvilWorld.Create(path);
			this.position = position;
			this.direction = direction;
		}

		public void Interprete(string folder)
		{
			foreach (string file in Directory.GetFiles(folder))
			{
				InterpreteFunction(File.ReadAllText(file));
				UpdatePosition(() => position.X += sidewards, () => position.X -= sidewards, () => position.Z += sidewards, () => position.Z -= sidewards);
			}
		}

		private void InterpreteFunction(string source)
		{
			foreach (string call in source.Split(';'))
			{
				InterpreteCall(call.Trim());
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
					PlaceBlock(75, ((int)direction == 4) ? (int)direction++ : 1);
				break;
				case 'r': //r for redstone R epeater
					PlaceBlock(93, (int)direction);
				break;
				case 'o': //o for analog O utput (comparator)
					PlaceBlock(149, (int)direction);
				break;
				case 'c': //c for C ommandblock
					AlphaBlock cblock = new AlphaBlock (137);
					TileEntityControl te = cblock.GetTileEntity() as TileEntityControl; //unsafe
					te.Command = source.Substring(1);
					world.GetBlockManager().SetBlock(position.X, position.Y, position.Z, cblock);
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

		private void PlaceBlock(int id, int data)
		{
			world.GetBlockManager().SetID(position.X, position.Y, position.Z, id);
			world.GetBlockManager().SetData(position.X, position.Y, position.Z, data);
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

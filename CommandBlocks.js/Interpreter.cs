using System;
using System.IO;

using Substrate;
using Substrate.TileEntities;

namespace CommandBlocks.js
{
	public class Interpreter
	{
		private AnvilWorld world;
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
				switch (direction)
				{
					case MinecraftDirection.xMinus:
						position.X += sidewards;
					break;
					case MinecraftDirection.xPlus:
						position.X -= sidewards;
					break;
					case MinecraftDirection.zMinus:
						position.Z += sidewards;
					break;
					case MinecraftDirection.zPlus:
						position.Z -= sidewards;
					break;
				}
			}
		}

		public void InterpreteFunction(string source)
		{
			foreach (string call in source.Split(';'))
			{
				InterpreteCall(call.Trim());
				switch (direction)
				{
					case MinecraftDirection.xMinus:
						position.X--;
					break;
					case MinecraftDirection.xPlus:
						position.X++;
					break;
					case MinecraftDirection.zMinus:
						position.Z--;
					break;
					case MinecraftDirection.zPlus:
						position.Z++;
					break;
				}
			}
		}

		public void InterpreteCall(string source)
		{
			switch (source[0])
			{
				case 'w': //w for redstone W ire
					world.GetBlockManager().SetID(position.X, position.Y, position.Z, 55);
					world.GetBlockManager().SetData(position.X, position.Y, position.Z, 0);
				break;
				case 't': //t for redstone T orch
					world.GetBlockManager().SetID(position.X, position.Y, position.Z, 75);
					world.GetBlockManager().SetData(position.X, position.Y, position.Z, ((int)direction == 4) ? (int)direction++ : 1);
				break;
				case 'r': //r for redstone R epeater
					world.GetBlockManager().SetID(position.X, position.Y, position.Z, 93);
					world.GetBlockManager().SetData(position.X, position.Y, position.Z, (int)direction);
				break;
				case 'o': //o for analog O utput (comparator)
					world.GetBlockManager().SetID(position.X, position.Y, position.Z, 149);
					world.GetBlockManager().SetData(position.X, position.Y, position.Z, (int)direction);
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
					world.GetBlockManager().SetID(position.X, position.Y, position.Z, id);
					world.GetBlockManager().SetData(position.X, position.Y, position.Z, data);
				break;
				case 's': //s for S idewards
					string[] calls = source.Substring(1).Split(':');
					if (calls.Length + 2 > sidewards)
						sidewards = calls.Length + 2;

					foreach (string call in calls)
					{
						InterpreteCall(call.Trim());
						switch (direction)
						{
							case MinecraftDirection.xMinus:
								position.Z++;
							break;
							case MinecraftDirection.xPlus:
								position.Z--;
							break;
							case MinecraftDirection.zMinus:
								position.X++;
							break;
							case MinecraftDirection.zPlus:
								position.X--;
							break;
						}
					}
				break;
			}
		}
	}
}

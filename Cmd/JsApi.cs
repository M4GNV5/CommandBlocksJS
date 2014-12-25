using Substrate;
using Substrate.Core;
using Substrate.TileEntities;
using System;
using System.IO;

namespace CommandBlocksJS.Cmd
{
	public class JsApi
	{
		private NbtWorld world;
		private IBlockManager blockManager;

		public JsApi(string worldDirectory)
		{
			if (!Directory.Exists(worldDirectory))
				Directory.CreateDirectory(worldDirectory);

			this.world = AnvilWorld.Create(worldDirectory);
			this.blockManager = this.world.GetBlockManager();
		}

		public void log(string message)
		{
			Console.WriteLine(message);
		}

		public void disco(int wait = 1, int count = 1)
		{//this is defnitly not an easter egg
			for (int i = 0; i < count; i++)
			{
				Console.Beep();
				System.Threading.Thread.Sleep(wait);
			}
		}

		public void placeBlock(int id, int data, int x, int y, int z)
		{
			int blockBelow = blockManager.GetID(x, y - 1, z);

			if (blockBelow == BlockType.AIR
				|| blockBelow == BlockType.WATER
				|| blockBelow == BlockType.STATIONARY_WATER
				|| blockBelow == BlockType.LAVA
				|| blockBelow == BlockType.STATIONARY_LAVA)
			{
				blockManager.SetID(x, y - 1, z, BlockType.STONE);
				blockManager.SetData(x, y - 1, z, 0);
			}

			blockManager.SetID(x, y, z, id);
			blockManager.SetData(x, y, z, data);
		}

		public void placeCommandBlock(string command, int x, int y, int z)
		{
			AlphaBlock cblock = new AlphaBlock(BlockType.COMMAND_BLOCK);
			TileEntityControl te = cblock.GetTileEntity() as TileEntityControl; //unsafe
			te.Command = command;
			blockManager.SetBlock(x, y, z, cblock);
		}

		public void placeSign(string[] text, int direction, int x, int y, int z)
		{
			AlphaBlock sign = new AlphaBlock(BlockType.SIGN_POST);
			TileEntitySign te = sign.GetTileEntity() as TileEntitySign;
			sign.Data = direction;

			if (text.Length > 0)
				te.Text1 = text[0];
			if (text.Length > 1)
				te.Text2 = text[1];
			if (text.Length > 2)
				te.Text3 = text[2];
			if (text.Length > 3)
				te.Text4 = text[3];
		}

		public void save()
		{
			world.Save();
		}
	}
}
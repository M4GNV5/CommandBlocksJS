using System;
using System.IO;

using Substrate;
using Substrate.Core;
using Substrate.TileEntities;
using CommandBlocksJS.Core;

namespace CommandBlocksJS
{
	public class DefaultWorldHandler : IWorldHandler
	{
		private NbtWorld world;
		private IBlockManager blockManager;

		public DefaultWorldHandler (string worldDirectory)
		{
			if (!Directory.Exists(worldDirectory))
				throw new System.IO.DirectoryNotFoundException ("The given world was not found!");

			this.world = AnvilWorld.Create(worldDirectory);
			this.blockManager = this.world.GetBlockManager();
		}

		public void PlaceBlock(int id, int data, IntVector3 position)
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

			blockManager.SetID(position.x, position.y, position.z, id);
			blockManager.SetData(position.x, position.y, position.z, data);
		}

		public void PlaceCommandBlock(string command, IntVector3 position)
		{
			AlphaBlock cblock = new AlphaBlock (BlockType.COMMAND_BLOCK);
			TileEntityControl te = cblock.GetTileEntity() as TileEntityControl; //unsafe
			te.Command = command;
			blockManager.SetBlock(position.x, position.y, position.z, cblock);
		}

		public void Save()
		{
			world.Save();
		}
	}
}


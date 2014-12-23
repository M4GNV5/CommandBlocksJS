using Substrate;
using Substrate.Core;
using Substrate.ImportExport;
using Substrate.Nbt;
using Substrate.TileEntities;
using System;
using System.Collections.Generic;
using System.IO;

namespace CommandBlocksJS.Cmd
{
	public class JsApi
	{
		private NbtWorld world;
		private IBlockManager blockManager;
		private Dictionary<IntVector3, AlphaBlock> blocks;

		public JsApi(string worldDirectory)
		{
			if (!Directory.Exists(worldDirectory))
				throw new System.IO.DirectoryNotFoundException("The given world was not found!");

			this.world = AnvilWorld.Create(worldDirectory);
			this.blockManager = this.world.GetBlockManager();
			this.blocks = new Dictionary<IntVector3, AlphaBlock>();
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

				if (blocks.ContainsKey(new IntVector3(x, y - 1, z)))
				{
					blocks.Remove(new IntVector3(x, y - 1, z));
				}
				blocks.Add(new IntVector3(x, y - 1, z), new AlphaBlock(BlockType.STONE, 0));
			}

			blockManager.SetID(x, y, z, id);
			blockManager.SetData(x, y, z, data);
			if (blocks.ContainsKey(new IntVector3(x, y, z)))
			{
				blocks.Remove(new IntVector3(x, y, z));
			}
			blocks.Add(new IntVector3(x, y, z), new AlphaBlock(id, data));
		}

		public void placeCommandBlock(string command, int x, int y, int z)
		{
			AlphaBlock cblock = new AlphaBlock(BlockType.COMMAND_BLOCK);
			TileEntityControl te = cblock.GetTileEntity() as TileEntityControl; //unsafe
			te.Command = command;
			blockManager.SetBlock(x, y, z, cblock);
			if (blocks.ContainsKey(new IntVector3(x, y, z)))
			{
				blocks.Remove(new IntVector3(x, y, z));
			}
			blocks.Add(new IntVector3(x, y, z), cblock);
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

			blockManager.SetBlock(x, y, z, sign);
			if (blocks.ContainsKey(new IntVector3(x, y, z)))
			{
				blocks.Remove(new IntVector3(x, y, z));
			}
			blocks.Add(new IntVector3(x, y, z), sign);
		}

		public void saveWorld()
		{
			world.Save();
		}

		public void exportSchematic(string path)
		{
			int maxX, maxY, maxZ;
			maxX = maxY = maxZ = 0;

			foreach (var block in blocks)
			{
				maxX = Math.Max(maxX, block.Key.x);
				maxY = Math.Max(maxY, block.Key.y);
				maxZ = Math.Max(maxZ, block.Key.z);
			}
			AlphaBlockCollection schematicBlocks = new AlphaBlockCollection(maxX + 1, maxY + 1, maxZ + 1);
			EntityCollection schematicEntities = new EntityCollection(new TagNodeList(TagType.TAG_COMPOUND));
			foreach (var block in blocks)
			{
				if (block.Key.x > maxX)
					throw new IndexOutOfRangeException();
				if (block.Key.y > maxY)
					throw new IndexOutOfRangeException();
				if (block.Key.z > maxZ)
					throw new IndexOutOfRangeException();

				if (block.Key.x < 0)
					throw new IndexOutOfRangeException();
				if (block.Key.y < 0)
					throw new IndexOutOfRangeException();
				if (block.Key.z < 0)
					throw new IndexOutOfRangeException();

				schematicBlocks.SetBlock(block.Key.x, block.Key.y, block.Key.z, block.Value);
			}

			Schematic schematic = new Schematic(schematicBlocks, schematicEntities);
			schematic.Export(path);
		}
	}
}
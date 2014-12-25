using CommandBlocksJS.Cmd;
using Substrate;
using Substrate.ImportExport;
using Substrate.Nbt;
using Substrate.TileEntities;
using System;
using System.Collections.Generic;
using System.IO;

namespace CommandblocksJS.Cmd
{
	public class JsSchematicApi
	{
		private Dictionary<IntVector3, AlphaBlock> blocks;
		private string path;

		public JsSchematicApi(string path)
		{
			this.blocks = new Dictionary<IntVector3, AlphaBlock>();
			this.path = path;
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
			if (blocks.ContainsKey(new IntVector3(x, y - 1, z)))
			{
				blocks.Remove(new IntVector3(x, y - 1, z));
			}
			blocks.Add(new IntVector3(x, y - 1, z), new AlphaBlock(BlockType.STONE, 0));

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

			if (blocks.ContainsKey(new IntVector3(x, y, z)))
			{
				blocks.Remove(new IntVector3(x, y, z));
			}
			blocks.Add(new IntVector3(x, y, z), sign);
		}

		public void save()
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
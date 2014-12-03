using System;
using System.Threading;
namespace CommandblocksJS.ServerWrapper
{
	public class JsApi
	{
		private Wrapper server;
		public JsApi(Wrapper server)
		{
			this.server = server;
		}
		public void log(string message)
		{
			this.server.RunCommand("say <CBJS> " + message);
		}
		public void disco(int wait = 1, int count = 1)
		{
			for (int i = 0; i < count; i++)
			{
				Console.Beep();
				Thread.Sleep(wait);
			}
		}
		public void placeBlock(int id, int data, int x, int y, int z)
		{
			this.placeStone(x, y - 1, z);
			string text = ((MinecraftBlock)id).ToString().ToLower();

			string command = string.Format("setblock {2} {3} {4} minecraft:{0} {1} replace", text, data, x, y, z);
			server.RunCommand(command);
		}
		public void placeCommandBlock(string cmd, int x, int y, int z)
		{
			this.placeStone(x, y - 1, z);
			cmd = cmd.Replace("\"", "\\\"");
			string command = string.Format("setblock {1} {2} {3} minecraft:command_block 0 replace {{Command:\"{0}\"}}", cmd, x, y, z);
			this.server.RunCommand(command);
		}
		private void placeStone(int x, int y, int z)
		{
			string command = string.Format("setblock {0} {1} {2} minecraft:stone 0 keep", x, y, z);
			this.server.RunCommand(command);
		}
		public void placeSign(string[] text, int direction, int x, int y, int z)
		{
			this.server.RunCommand("say Signs are not Supported yet!");
		}
		public void saveWorld()
		{
			this.server.RunCommand("save-all");
		}
	}
}

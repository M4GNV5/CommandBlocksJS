using System;

namespace CommandblocksJS.ServerWrapper
{
	class MainClass
	{
		public static void Main(string[] args)
		{
			Wrapper wrapper = new Wrapper();
			wrapper.Start();
			string text = "";
			while (text != "stop")
			{
				if (!string.IsNullOrWhiteSpace(text))
				{
					wrapper.RunCommand(text);
					wrapper.ReadServerOutput(text);
				}
				text = Console.ReadLine();
			}
			wrapper.Stop();
			Console.ReadKey();
		}
	}
}

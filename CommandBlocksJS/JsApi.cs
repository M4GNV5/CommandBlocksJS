using System;

using CommandBlocksJS.Core;

namespace CommandBlocksJS
{
	public class JsApi
	{
		public ScriptOutput Output { get; set; }

		public JsApi()
		{
			Output = new ScriptOutput ();
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
		public void addOutput(string name, string function)
		{
			Output.Functions.Add(name, function);
		}
	}
}


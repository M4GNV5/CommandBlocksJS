using System;
using System.IO;

using Noesis.Javascript;

namespace CommandBlocksJS
{
	public class MainClass
	{
		public const string help = "";
		public static readonly string tempDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "output");

		public static int Main (string[] args)
		{
			string script = null;
			string world = null;
			IntVector3 position = new IntVector3();
			MinecraftDirection direction = MinecraftDirection.xPlus;

			bool keepTemp = false;
			bool writeToWorld = true;

			for (int i = 0; i < args.Length; i++)
			{
				switch (args [i].ToLower())
				{
					case "--script": case "-s":
						i++;
						script = args [i];
					break;
					case "--world": case "-w":
						i++;
						world = args [i];
					break;
					case "--position": case "-p":
						i++;
						position.X = Convert.ToInt32(args [i]);
						i++;
						position.Y = Convert.ToInt32(args [i]);
						i++;
						position.Z = Convert.ToInt32(args [i]);
					break;
					case "--direction": case "-d":
						i++;
						direction = (MinecraftDirection)Convert.ToInt32(args [i]);
					break;
					case "--keeptemp":
						keepTemp = true;
					break;
					case "--nooutput":
						writeToWorld = false;
					break;
					case "--help":
						Console.WriteLine(help);
						return 0;
				}
			}
				
			if (Directory.Exists(tempDir))
			{
				Console.WriteLine("Error: output directory already exists!");
				return 1;
			}
			else
			{
				Directory.CreateDirectory(tempDir);
			}

			ExecuteScript(script);
			if (writeToWorld)
			{
				JsOutputParser parser = new JsOutputParser (world, position, direction);
				parser.ParseDirectory(tempDir);
			}
			if (!keepTemp)
				Directory.Delete(tempDir, true);

			return 0;
		}

		public static void ExecuteScript(string scriptPath)
		{
			string basePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "base.js");
			string baseLibs = File.ReadAllText(basePath);
			string userCode = File.ReadAllText(scriptPath);
			string code = baseLibs.Replace("%code%", userCode);
			JavascriptContext context = new JavascriptContext ();
			context.SetParameter("fs", new JsFileAPI (tempDir));
			context.Run(code);
		}
	}
}

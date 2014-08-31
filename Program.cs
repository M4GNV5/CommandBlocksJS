using System;
using System.IO;

using Noesis.Javascript;

namespace CommandBlocks.js
{
	public class MainClass
	{
		public const string help = "";

		public static int Main (string[] args)
		{
			string script;
			string world;
			IntVector3 position = new IntVector3();
			MinecraftDirection direction;

			bool keepTemp = false;
			bool writeToWorld = true;

			for (int i = 0; i < args.Length; i++)
			{
				switch (args [i])
				{
					case("--script" || "-s"):
						i++;
						script = args [i];
					break;
					case("--world" || "-w"):
						i++;
						world = args [i];
					break;
					case("--position" || "-p"):
						i++;
						position.X = Convert.ToInt32(args [i]);
						i++;
						position.Y = Convert.ToInt32(args [i]);
						i++;
						position.Z = Convert.ToInt32(args [i]);
					break;
					case("--direction" || "-d"):
						i++;
						direction = (MinecraftDirection)Convert.ToInt32(args [i]);
					break;
					case("--keepTemp"):
						keepTemp = true;
					break;
					case("--output"):
						writeToWorld = false;
					break;
				}
			}

			string tempDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "output");
			if (Directory.Exists(tempDir))
			{
				Console.WriteLine("Error: output directory already exists!");
				return 1;
			}
			else
			{
				Directory.CreateDirectory(tempDir);
			}

			//TODO try catch?!
			ExecuteScript(script);
			if (writeToWorld)
			{
				Interpreter inte = new Interpreter (world, position, direction);
				inte.Interprete(tempDir);
			}
			if (!keepTemp)
				Directory.Delete(tempDir, true);

			return 0;
		}

		public static void ExecuteScript(string scriptPath)
		{
			string basePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "base.js");
			string code = File.ReadAllText(basePath) + File.ReadAllText(scriptPath);
			JavascriptContext context = new JavascriptContext ();
			context.Run(code);
		}
	}
}

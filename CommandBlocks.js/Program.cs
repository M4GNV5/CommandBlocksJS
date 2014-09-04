using System;
using System.IO;

using CommandLine;
using CommandLine.Text;
using Noesis.Javascript;

namespace CommandBlocksJS
{
	public class MainClass
	{
		private sealed class Options
		{
			[Option('s', "script", MetaValue = "FILE", Required = true, HelpText = "Script file that will be processed to commandblocks.")]
			public string ScriptFile {get; set;}

			[Option('w', "world", Required = true, HelpText = "The Directory of the world the commandblocks will be built in.")]
			public string WorldDirectory { get; set; }

			[Option('p', "position", Required = true, HelpText = "The start-position where to build the commandblocks.")]
			public string Position { get; set; }

			[Option('d', "direction", DefaultValue = 0, HelpText = "The direction to build the commandblocks.")]
			public int Direction { get; set; }

			[Option("keeptemp", DefaultValue = false, HelpText = "Keep temporary Files true/false.")]
			public bool KeepTemp { get; set; }

			[Option("output", DefaultValue = true, HelpText = "Write Script to World true/false.")]
			public bool Output { get; set; }
		}

		public const string help = "";
		public static readonly string tempDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "output");

		public static int Main (string[] args) //example: -s myscript.js -w ./myworld -p 1.4.16 -d 1
		{
			try
			{
				Options options = new Options ();
				Parser cmdParser = new Parser ();
				cmdParser.ParseArguments(args, options);

				IntVector3 position = new IntVector3 ();
				string[] pos = options.Position.Split('_', '-', '|', ' ', '.', ',', ';', ':');
				position.X = Convert.ToInt32(pos [0]);
				position.Y = Convert.ToInt32(pos [1]);
				position.Z = Convert.ToInt32(pos [2]);

				MinecraftDirection direction = (MinecraftDirection)options.Direction;
					
				if (Directory.Exists(tempDir))
				{
					Console.WriteLine("Error: output directory already exists!");
					return 1;
				}
				else
				{
					Directory.CreateDirectory(tempDir);
				}

				ExecuteScript(options.ScriptFile);
				if (options.Output)
				{
					JsOutputParser parser = new JsOutputParser (options.WorldDirectory, position, direction);
					parser.ParseDirectory(tempDir);
				}
				if (!options.KeepTemp)
					Directory.Delete(tempDir, true);
				return 0;
			}
			catch(Exception e)
			{
				Console.WriteLine("An Error of type {0} occured! Please create an issue on Github!", e.GetType());
				return -1;
			}
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

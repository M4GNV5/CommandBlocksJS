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

			[Option('l', "lib", DefaultValue = "./libs", HelpText = "Javascript files (.js) in this directory will be used as Library")]
			public string LibPath { get; set; }

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

				if(!cmdParser.ParseArguments(args, options))
					throw new ArgumentException("Invalid Commandline parameter!");

				IntVector3 position = new IntVector3 ();
				string[] pos = options.Position.Split('_', '|', ' ', '.', ',', ';', ':');
				position.x = Convert.ToInt32(pos [0]);
				position.y = Convert.ToInt32(pos [1]);
				position.z = Convert.ToInt32(pos [2]);

				MinecraftDirection direction = MinecraftDirection.xPlus;
					
				if (Directory.Exists(tempDir))
				{
					Console.WriteLine("Error: output directory already exists!");
					return 1;
				}
				else
				{
					Directory.CreateDirectory(tempDir);
				}

				new JsScriptExecutor().Run(options.LibPath, options.ScriptFile); //TODO reimplement direction

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
				Console.WriteLine("An Error of type {0} occured!", e.GetType());
				Console.WriteLine("Error Message: {0}", e.Message);

				if (Directory.Exists(tempDir))
				{
					Directory.Delete(tempDir, true);
				}

				return -1;
			}
		}
	}
}

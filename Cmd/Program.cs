using CommandLine;
using CommandLine.Text;
using System;
using System.IO;

namespace CommandBlocksJS.Cmd
{
	public class MainClass
	{
		private sealed class Options
		{
			[Option('s', "script", MetaValue = "FILE", Required = true, HelpText = "Script file that will be processed to commandblocks.")]
			public string ScriptFile { get; set; }

			[Option('w', "world", Required = true, HelpText = "The Directory of the world the commandblocks will be built in.")]
			public string WorldDirectory { get; set; }

			[Option('e', "schematic", Required = false, HelpText = "Export schematic true/false.")]
			public bool IsSchematic { get; set; }

			[Option('x', "posx", Required = false, HelpText = "The X-start-position where to build the commandblocks.")]
			public int PositionX { get; set; }

			[Option('y', "posy", Required = false, HelpText = "The Y-start-position where to build the commandblocks.")]
			public int PositionY { get; set; }

			[Option('z', "posz", Required = false, HelpText = "The Z-start-position where to build the commandblocks.")]
			public int PositionZ { get; set; }

			[Option('l', "lib", DefaultValue = "core.js", HelpText = "Javascript file (.js) that contains CommandblocksJS core Javascript code")]
			public string LibPath { get; set; }

			[Option("output", DefaultValue = true, HelpText = "Write Script to World true/false.")]
			public bool Output { get; set; }
		}

		public static int Main(string[] args)
		{
#if DEBUG
			args = "-s example.js -w ./world -x 0 -y 4 -z 0".Split(' ');
#endif

#if !DEBUG
			try
			{
#endif
				Options options = new Options();
				Parser cmdParser = new Parser();

				if (!cmdParser.ParseArguments(args, options))
					throw new ArgumentException("Invalid Commandline parameter!");

				IntVector3 position = default(IntVector3);
				if (options.Output)
				{
					if (options.PositionY != 0)
					{
						position = new IntVector3();
						position.x = options.PositionX;
						position.y = options.PositionY;
						position.z = options.PositionZ;
					}
				}

				JsScriptExecutor executor = new JsScriptExecutor();
				executor.Run(options.LibPath, options.ScriptFile, options.WorldDirectory, position, options.IsSchematic);
#if !DEBUG
			}
			catch (Exception e)
			{
				Console.WriteLine("An Error of type {0} occured!", e.GetType());
				Console.WriteLine("Error Message: {0}", e.Message);
				return 1;
			}
#endif
			return 0;
		}
	}
}
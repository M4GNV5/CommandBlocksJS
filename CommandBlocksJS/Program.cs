using System;
using System.IO;

using CommandLine;
using CommandLine.Text;
using Noesis.Javascript;
using CommandBlocksJS.Core;

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

			[Option('x', "posx", Required = false, HelpText = "The X-start-position where to build the commandblocks.")]
			public int PositionX { get; set; }

			[Option('y', "posy", Required = false, HelpText = "The Y-start-position where to build the commandblocks.")]
			public int PositionY { get; set; }

			[Option('z', "posz", Required = false, HelpText = "The Z-start-position where to build the commandblocks.")]
			public int PositionZ { get; set; }

			[Option('l', "lib", DefaultValue = "./libs", HelpText = "Javascript files (.js) in this directory will be used as Library")]
			public string LibPath { get; set; }

			[Option("output", DefaultValue = true, HelpText = "Write Script to World true/false.")]
			public bool Output { get; set; }
		}

		public static int Main (string[] args) //example: -s myscript.js -w ./myworld -x 1 -y 4 -z 16
		{
			try
			{
				Options options = new Options ();
				Parser cmdParser = new Parser ();

				if(!cmdParser.ParseArguments(args, options))
					throw new ArgumentException("Invalid Commandline parameter!");

				IScriptExecutor executor = new JsScriptExecutor();
				ScriptOutput output = executor.Run(options.LibPath, options.ScriptFile);

				if (options.Output)
				{
					IntVector3 position = default(IntVector3);
					if(options.PositionY != 0)
					{
						position = new IntVector3 ();
						position.x = options.PositionX;
						position.y = options.PositionY;
						position.z = options.PositionZ;
					}

					IWorldHandler worldHandler = new DefaultWorldHandler(options.WorldDirectory);

					OutputParser parser = new OutputParser (worldHandler);
					parser.ParseOutput(output, position);
				}
			}
			catch(Exception e)
			{
				Console.WriteLine("An Error of type {0} occured!", e.GetType());
				Console.WriteLine("Error Message: {0}", e.Message);
				return 1;
			}
			return 0;
		}
	}
}

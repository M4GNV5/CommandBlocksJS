using System;
using System.Collections.Generic;

namespace CommandBlocksJS.Core
{
	public class ScriptOutput
	{
		public Dictionary<string, string> Functions { get; set; }

		public ScriptOutput ()
		{
			this.Functions = new Dictionary<string, string> ();
		}
		public ScriptOutput (Dictionary<string, string> functions)
		{
			this.Functions = functions;
		}
	}
}


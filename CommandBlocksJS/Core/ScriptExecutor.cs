using System;

namespace CommandBlocksJS.Core
{
	public abstract class ScriptExecutor
	{
		public abstract ScriptOutput Run(string libPath, string scriptPath);
	}
}


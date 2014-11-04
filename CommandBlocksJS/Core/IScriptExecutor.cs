using System;

namespace CommandBlocksJS.Core
{
	public interface IScriptExecutor
	{
		ScriptOutput Run(string libPath, string scriptPath);
	}
}


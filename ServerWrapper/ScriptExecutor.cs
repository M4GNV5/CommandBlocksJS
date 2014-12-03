using Noesis.Javascript;
using System;
using System.IO;
namespace CommandblocksJS.ServerWrapper
{
	public static class ScriptExecutor
	{
		private static readonly string coreJsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "core.js");
		public static void Run(Wrapper server, string scriptPath, int x, int y, int z)
		{
			string core = File.ReadAllText(ScriptExecutor.coreJsPath);
			string user = File.ReadAllText(scriptPath);

			JavascriptContext javascriptContext = new JavascriptContext();
			JsApi jsApi = new JsApi(server);
			javascriptContext.SetParameter("api", jsApi);

			try
			{
				javascriptContext.Run(core);
				string code = string.Format("var startPosition = new Vector3({0}, {1}, {2});", x, y, z);
				javascriptContext.Run(code);
			}
			catch (JavascriptException ex)
			{
				string error = string.Format("Javascripterror: '{0}' at Line {1} Column {2} to {3}", ex.Message, ex.Line, ex.StartColumn, ex.EndColumn);
				throw new SystemException("Error in CommandblockJS Core Javascript code! Please make sure you are using the latest build\n\n" + error);
			}

			try
			{
				javascriptContext.Run(user + "\n cbjsWorker();");
			}
			catch (JavascriptException ex)
			{
				string error = string.Format("Javascripterror: '{0}' at Line {1} Column {2} to {3}", ex.Message, ex.Line, ex.StartColumn, ex.EndColumn);
				throw new ApplicationException(error);
			}
		}
	}
}

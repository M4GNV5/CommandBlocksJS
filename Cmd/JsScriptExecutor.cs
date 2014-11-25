using System;
using System.IO;
using System.Text;

using Noesis.Javascript;

namespace CommandBlocksJS.Cmd
{
	public class JsScriptExecutor
	{
		public void Run(string coreJsPath, string scriptPath, string worldDirectory, IntVector3 position)
		{
			string coreCode = File.ReadAllText(coreJsPath);
			string usercode = File.ReadAllText(scriptPath);

			JavascriptContext jsContext = new JavascriptContext();

			JsApi api = new JsApi(worldDirectory);
			jsContext.SetParameter("api", api);

			try
			{
				jsContext.Run(coreCode);
				jsContext.Run("var startPosition = new Vector3("+position.x+", "+position.y+", "+position.z+");");
			}
			catch (JavascriptException e)
			{
				string error = string.Format("Javascripterror: '{0}' at Line {1} Column {2} to {3}", e.Message, e.Line, e.StartColumn, e.EndColumn);
				throw new SystemException ("Error in CommandblockJS Core Javascript code! Please make sure you are using the latest build\n\n"+error);
			}

			try
			{
				jsContext.Run(usercode+"\n cbjsWorker();");
			}
			catch(JavascriptException e)
			{
				string message = string.Format("Javascripterror: '{0}' at Line {1} Column {2} to {3}", e.Message, e.Line, e.StartColumn, e.EndColumn);
				throw new ApplicationException (message);
			}
		}
	}
}


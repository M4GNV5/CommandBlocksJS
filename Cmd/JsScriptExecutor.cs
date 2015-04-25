using CommandblocksJS.Cmd;
using Jint;
using Jint.Runtime;
using Jint.Parser;
using System;
using System.IO;
using System.Text;

namespace CommandBlocksJS.Cmd
{
	public class JsScriptExecutor
	{
		public void Run(string coreJsPath, string scriptPath, string worldDirectory, IntVector3 position, bool isSchematic)
		{
			string coreCode = File.ReadAllText(coreJsPath);
			string usercode = File.ReadAllText(scriptPath);
			Engine jsEngine = new Engine();

			if (!isSchematic)
				jsEngine.SetValue("api", new JsApi(worldDirectory));
			else
				jsEngine.SetValue("api", new JsSchematicApi(worldDirectory));
#if DEBUG
			jsEngine.Execute(coreCode);
			jsEngine.Execute("var startPosition = new Util.Vector3(" + position.x + ", " + position.y + ", " + position.z + ");");
#else
			try
			{
				jsEngine.Execute(coreCode);
				jsEngine.Execute("var startPosition = new Util.Vector3(" + position.x + ", " + position.y + ", " + position.z + ");");
			}
			catch(ParserException e)
			{
				string error = string.Format("Javascripterror: '{0}' at Line {1} Column {2}", e.Description, e.LineNumber, e.Column);
				throw new SystemException("Error in CommandblockJS Core Javascript code! Please make sure you are using the latest build!\n\n" + error);
			}
			catch (JavaScriptException e)
			{
				string error = string.Format("Javascripterror: '{0}'", e.Message);
				throw new SystemException("Error in CommandblockJS Core Javascript code! Please make sure you are using the latest build!\n\n" + error);
			}
#endif

#if DEBUG
			jsEngine.Execute(usercode + "\n cbjsWorker();");
#else
			try
			{
				jsEngine.Execute(usercode + "\n cbjsWorker();");
			}
			catch(ParserException e)
			{
				string message = string.Format("Javascripterror: '{0}' at Line {1} Column {2}", e.Message, e.LineNumber, e.Column);
				throw new ApplicationException(message);
			}
			catch (JavaScriptException e)
			{
				string message = string.Format("Javascripterror: '{0}'", e.Message);
				throw new ApplicationException(message);
			}
#endif
		}
	}
}
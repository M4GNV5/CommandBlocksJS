using System;
using System.IO;
using System.Text;

using Noesis.Javascript;
using CommandBlocksJS.Core;

namespace CommandBlocksJS
{
	public class JsScriptExecutor : ScriptExecutor
	{
		public JavascriptContext JsContext { get; set; }
		private JsApi api;

		public JsScriptExecutor ()
		{
			JsContext = new JavascriptContext ();
			api = new JsApi ();

			JsContext.SetParameter("api", api);
		}

		public override ScriptOutput Run(string libDirectory, string scriptPath)
		{
			string code = "";
			try
			{
				StringBuilder sb = new StringBuilder ();
				foreach (string file in Directory.GetFiles(libDirectory, "*.js"))
				{
					string libCode = File.ReadAllText(file);
					sb.AppendLine(libCode);
				}
				sb.AppendLine("main();");

				string userCode = File.ReadAllText(scriptPath);
				string libcode = sb.ToString();

				code = libcode.Replace("%code%", userCode);

				JsContext.Run(code);
			}
			catch(JavascriptException e)
			{
				string message = string.Format("Javascripterror: '{0}' at '{1}'", e.Message, code.Split('\n') [e.Line - 1].Trim());
				throw new Exception (message);
			}

			return api.Output;
		}
	}
}


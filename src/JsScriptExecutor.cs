using System;
using System.IO;
using System.Text;

using Noesis.Javascript;

namespace CommandBlocksJS
{
	public class JsScriptExecutor
	{
		public JavascriptContext JsContext { get; set; }

		public JsScriptExecutor ()
		{
			JsContext = new JavascriptContext ();
			JsContext.SetParameter("fs", new JsFileAPI (MainClass.tempDir));
		}

		public void Run(string libDirectory, string scriptPath)
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
				throw new Exception ("Javascripterror: '"+e.Message+"' at '"+code.Split('\n')[e.Line-1].Trim()+"'");
			}
		}
	}
}


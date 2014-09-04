using System;
using System.IO;

namespace CommandBlocksJS
{
	public class JsFileAPI
	{
		public readonly string basePath;

		public JsFileAPI(string basePath)
		{
			this.basePath = basePath;
		}

		//kamelcase for javascript
		public void writeFile(string name, string contents)
		{
			string path = Path.Combine(basePath, name);
			File.WriteAllText(path, contents);
		}
	}
}


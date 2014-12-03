using System;
using System.Diagnostics;
namespace CommandblocksJS.ServerWrapper
{
	public class Wrapper
	{
		private Process mc;

		public Wrapper()
		{
			mc = new Process();
			mc.StartInfo = new ProcessStartInfo("java", "-jar server.jar");
			mc.StartInfo.UseShellExecute = false;
			mc.StartInfo.RedirectStandardOutput = true;
			mc.StartInfo.RedirectStandardInput = true;
			mc.StartInfo.RedirectStandardError = true;
			mc.StartInfo.CreateNoWindow = true;
			mc.OutputDataReceived += new DataReceivedEventHandler(this.ServerOutputReceived);
			mc.ErrorDataReceived += new DataReceivedEventHandler(this.ServerOutputReceived);
		}
		private void ServerOutputReceived(object sender, DataReceivedEventArgs e)
		{
			Console.WriteLine(e.Data);
			ReadServerOutput(e.Data);
		}
		public void ReadServerOutput(string data)
		{
			if (data.Contains("!cbjs"))
			{
				string[] _data = data.Split(new string[] {"!cbjs"}, StringSplitOptions.RemoveEmptyEntries);
				string text;
				if (_data.Length == 1)
					text = _data[0];
				else
					text = _data[1];
				string[] args = text.Split(new char[]{' '}, StringSplitOptions.RemoveEmptyEntries);

				if (args.Length != 4)
				{
					RunCommand("say Usage: cbjs <script> <x> <y> <z>");
				}
				else
				{
					try
					{
						string scriptPath = args[0];
						int x = Convert.ToInt32(args[1]);
						int y = Convert.ToInt32(args[2]);
						int z = Convert.ToInt32(args[3]);
						ScriptExecutor.Run(this, scriptPath, x, y, z);
					}
					catch (Exception e)
					{
						RunCommand("say <CBJS> Error: " + e.Message);
					}
				}
			}
		}
		public void RunCommand(string command)
		{
			if (!mc.HasExited)
			{
				mc.StandardInput.WriteLine(command);
			}
		}
		public void Start()
		{
			mc.Start();
			mc.BeginOutputReadLine();
			mc.BeginErrorReadLine();
		}
		public void Stop()
		{
			if (!mc.HasExited)
			{
				mc.StandardInput.WriteLine("stop");
			}
		}
	}
}

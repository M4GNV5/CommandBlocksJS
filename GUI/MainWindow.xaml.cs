using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CommandBlocksJS.GUI
{
	public class TextBoxStreamWriter : TextWriter
	{
		private TextBox output = null;
		private TextWriter defaultWriter = null;
		private StreamWriter file = null;

		public TextBoxStreamWriter(TextBox output, TextWriter defaultWriter)
		{
			this.output = output;
			this.defaultWriter = defaultWriter;
			this.file = File.CreateText("Log/log-" + DateTime.Now.ToString("s").Replace(':', '-') + ".txt");
		}

		public override void Write(char value)
		{
			base.Write(value);
			this.defaultWriter.Write(value);
			this.output.AppendText(value.ToString());
			this.file.Write(value);
		}

		public void Save()
		{
			this.file.Flush();
		}

		public override void Close()
		{
			this.file.Close();
			base.Close();
		}

		public override Encoding Encoding
		{
			get { return System.Text.Encoding.UTF8; }
		}
	}

	public partial class MainWindow : Window
	{
		private TextWriter cout = Console.Out;

		public MainWindow()
		{
			InitializeComponent();
		}

		private void onBrowseFileClick(object sender, RoutedEventArgs e)
		{
			OpenFileDialog ofd = new OpenFileDialog();
			ofd.Filter = "CommandBlocksJS files|*.js|All files|*";
			if (ofd.ShowDialog() == true)
			{
				if (!File.Exists(ofd.FileName))
				{
					MessageBox.Show("File does not exist!", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
				}
				else
				{
					tbFileName.Text = ofd.FileName;
					tbConsole.Text = File.ReadAllText(ofd.FileName);
				}
			}
		}

		private void onGenerateButtonClick(object sender, RoutedEventArgs ev)
		{
			tbConsole.Clear();
			if (!Directory.Exists("Log/"))
				Directory.CreateDirectory("Log/");

			var tb = new TextBoxStreamWriter(tbConsole, cout);

			Console.SetOut(tb);

			Console.WriteLine("Running CommandBlockJS");

			Thread.Sleep(1000);

			string world = cbWorldFolder.Text;

			IntVector3 pos = new IntVector3();

			int.TryParse(tbPosX.Text, out pos.x);
			int.TryParse(tbPosY.Text, out pos.y);
			int.TryParse(tbPosZ.Text, out pos.z);

			var js = new CommandBlocksJS.Cmd.JsScriptExecutor();
			try
			{
				js.Run("core.js", tbFileName.Text, world, pos, IsSchematic.IsChecked == true);

				Console.WriteLine("Generation finished successfully");
				tb.Save();
				if (cbClose.IsChecked == true)
					Close();
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				Console.WriteLine("Generation failed");
				tb.Save();
			}
		}

		private void cbWorldFolder_KeyUp(object sender, KeyEventArgs e)
		{
			if (cbWorldFolder.Text.EndsWith(".schematic"))
				IsSchematic.IsChecked = true;
			else if (cbWorldFolder.Text.EndsWith("/"))
				IsWorld.IsChecked = true;
		}
	}
}
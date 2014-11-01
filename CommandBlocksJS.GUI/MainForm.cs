using System;
using System.IO;
using System.Text;
using System.Windows.Forms;

using CommandBlocksJS;

namespace CommandBlocksJS.GUI
{
    public partial class MainForm : Form
    {
        public bool IsBusy { get; private set; }

        public MainForm()
        {
            InitializeComponent();
        }

        private void scriptButton_Click(object sender, EventArgs e)
        {
            OpenFileDialog fd = new OpenFileDialog();
            if(fd.ShowDialog() == DialogResult.OK)
            {
                scriptTextbox.Text = fd.FileName;
            }
        }

        private void worldButton_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog fd = new FolderBrowserDialog();
            if(fd.ShowDialog() == DialogResult.OK)
            {
                worldTextbox.Text = fd.SelectedPath;
            }
        }

        private void startButton_Click(object sender, EventArgs e)
        {
            if (IsBusy)
                return;
            IsBusy = true;

            try
            {
                startButton.Text = "Preparing";

                IntVector3 position = new IntVector3();
                position.x = Convert.ToInt32(positionXTextbox.Text);
                position.y = Convert.ToInt32(positionYTextbox.Text);
                position.z = Convert.ToInt32(positionZTextbox.Text);

				MinecraftDirection direction = MinecraftDirection.xPlus;

                if (Directory.Exists(MainClass.tempDir))
                {
                    Directory.Delete(MainClass.tempDir, true);
                }
                Directory.CreateDirectory(MainClass.tempDir);

                startButton.Text = "Executing Script";

                new JsScriptExecutor().Run("./libs", scriptTextbox.Text);

                startButton.Text = "Writing Output";

                JsOutputParser parser = new JsOutputParser(worldTextbox.Text, position, direction);
                parser.ParseDirectory(MainClass.tempDir);

                Directory.Delete(MainClass.tempDir, true);
            }
            catch(Exception ex)
            {
                string message = string.Format("An Error of type {0} occured!\nError Message: {1}", ex.GetType(), ex.Message);
                MessageBox.Show(message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                if (Directory.Exists(MainClass.tempDir))
                {
                    Directory.Delete(MainClass.tempDir, true);
                }
                IsBusy = false;
                return;
            }

            startButton.Text = "Start";
            IsBusy = false;
            MessageBox.Show("Successfully executed script and wrote Commandblocks to world", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }
}

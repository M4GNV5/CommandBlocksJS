using System;
using System.IO;
using System.Text;
using System.Windows.Forms;

using CommandBlocksJS;
using CommandBlocksJS.Core;

namespace CommandBlocksJS.GUI
{
    public partial class MainForm : Form
    {
        public bool IsBusy { get; private set; }

        private static readonly string appdataPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        private static readonly string savesPath = Path.Combine(appdataPath, ".minecraft/saves");

        private string[] saves;

        public MainForm()
        {
            InitializeComponent();
            saves = Directory.GetDirectories(savesPath);
            foreach (string save in saves)
                worldDropdown.Items.Add(Path.GetFileNameWithoutExtension(save));
        }

        private void scriptButton_Click(object sender, EventArgs e)
        {
            OpenFileDialog fd = new OpenFileDialog();
            if(fd.ShowDialog() == DialogResult.OK)
            {
                scriptTextbox.Text = fd.FileName;
            }
        }

        private void savesButton_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog fd = new FolderBrowserDialog();
            fd.RootFolder = Environment.SpecialFolder.ApplicationData;
            if (fd.ShowDialog() == DialogResult.OK)
            {
                worldTextbox.Text = fd.SelectedPath;
                TryAutoPosition();
            }
        }

        private void worldButton_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog fd = new FolderBrowserDialog();
            if(fd.ShowDialog() == DialogResult.OK)
            {
                worldTextbox.Text = fd.SelectedPath;
                TryAutoPosition();
            }
        }

        private void worldDropdown_SelectedValueChanged(object sender, EventArgs e)
        {
            string path = Path.Combine(savesPath, saves[worldDropdown.SelectedIndex]);
            worldTextbox.Text = path;

            TryAutoPosition();
        }

        private void TryAutoPosition()
        {
            OutputParser parser = new OutputParser(worldTextbox.Text);
            try
            {
                IntVector3 pos = parser.GetDefaultPosition();
                if (!pos.Equals(default(IntVector3)))
                {
                    positionXTextbox.Text = pos.x.ToString();
                    positionYTextbox.Text = pos.y.ToString();
                    positionZTextbox.Text = pos.z.ToString();
                }
            }
            catch
            { }
        }

        private void startButton_Click(object sender, EventArgs e)
        {
			if (IsBusy)
                return;
            IsBusy = true;

            try
            {
                ScriptExecutor executor = new JsScriptExecutor();
				ScriptOutput output = executor.Run("./libs", scriptTextbox.Text);

                int posX = Convert.ToInt32(positionXTextbox.Text);
                int posY = Convert.ToInt32(positionYTextbox.Text);
                int posZ = Convert.ToInt32(positionZTextbox.Text);

				IntVector3 position = default(IntVector3);
				if(posY != 0)
				{
					position = new IntVector3 (posX, posY, posZ);
				}

				OutputParser parser = new OutputParser (worldTextbox.Text);
				parser.ParseOutput(output, position);

            }
            catch(Exception ex)
            {
                string message = string.Format("An Error of type {0} occured!\nError Message: {1}", ex.GetType(), ex.Message);
                MessageBox.Show(message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                IsBusy = false;
                return;
            }

            startButton.Text = "Start";
            IsBusy = false;
            MessageBox.Show("Successfully executed script and wrote Commandblocks to world", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }
}

namespace CommandBlocksJS.GUI
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Vom Windows Form-Designer generierter Code

        private void InitializeComponent()
        {
            this.scriptLabel = new System.Windows.Forms.Label();
            this.worldLabel = new System.Windows.Forms.Label();
            this.scriptTextbox = new System.Windows.Forms.TextBox();
            this.scriptButton = new System.Windows.Forms.Button();
            this.worldButton = new System.Windows.Forms.Button();
            this.worldTextbox = new System.Windows.Forms.TextBox();
            this.positionLabel = new System.Windows.Forms.Label();
            this.positionZTextbox = new System.Windows.Forms.TextBox();
            this.positionYTextbox = new System.Windows.Forms.TextBox();
            this.positionXTextbox = new System.Windows.Forms.TextBox();
            this.startButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // scriptLabel
            // 
            this.scriptLabel.AutoSize = true;
            this.scriptLabel.Location = new System.Drawing.Point(13, 13);
            this.scriptLabel.Name = "scriptLabel";
            this.scriptLabel.Size = new System.Drawing.Size(34, 13);
            this.scriptLabel.TabIndex = 0;
            this.scriptLabel.Text = "Script";
            // 
            // worldLabel
            // 
            this.worldLabel.AutoSize = true;
            this.worldLabel.Location = new System.Drawing.Point(13, 43);
            this.worldLabel.Name = "worldLabel";
            this.worldLabel.Size = new System.Drawing.Size(35, 13);
            this.worldLabel.TabIndex = 1;
            this.worldLabel.Text = "World";
            // 
            // scriptTextbox
            // 
            this.scriptTextbox.Location = new System.Drawing.Point(95, 10);
            this.scriptTextbox.Name = "scriptTextbox";
            this.scriptTextbox.Size = new System.Drawing.Size(139, 20);
            this.scriptTextbox.TabIndex = 2;
            // 
            // scriptButton
            // 
            this.scriptButton.Location = new System.Drawing.Point(240, 8);
            this.scriptButton.Name = "scriptButton";
            this.scriptButton.Size = new System.Drawing.Size(32, 23);
            this.scriptButton.TabIndex = 3;
            this.scriptButton.Text = "...";
            this.scriptButton.UseVisualStyleBackColor = true;
            this.scriptButton.Click += new System.EventHandler(this.scriptButton_Click);
            // 
            // worldButton
            // 
            this.worldButton.Location = new System.Drawing.Point(240, 38);
            this.worldButton.Name = "worldButton";
            this.worldButton.Size = new System.Drawing.Size(32, 23);
            this.worldButton.TabIndex = 4;
            this.worldButton.Text = "...";
            this.worldButton.UseVisualStyleBackColor = true;
            this.worldButton.Click += new System.EventHandler(this.worldButton_Click);
            // 
            // worldTextbox
            // 
            this.worldTextbox.Location = new System.Drawing.Point(95, 40);
            this.worldTextbox.Name = "worldTextbox";
            this.worldTextbox.Size = new System.Drawing.Size(139, 20);
            this.worldTextbox.TabIndex = 5;
            // 
            // positionLabel
            // 
            this.positionLabel.AutoSize = true;
            this.positionLabel.Location = new System.Drawing.Point(13, 70);
            this.positionLabel.Name = "positionLabel";
            this.positionLabel.Size = new System.Drawing.Size(44, 13);
            this.positionLabel.TabIndex = 6;
            this.positionLabel.Text = "Position";
            // 
            // positionZTextbox
            // 
            this.positionZTextbox.Location = new System.Drawing.Point(217, 67);
            this.positionZTextbox.Name = "positionZTextbox";
            this.positionZTextbox.Size = new System.Drawing.Size(55, 20);
            this.positionZTextbox.TabIndex = 7;
            this.positionZTextbox.Text = "Z";
            this.positionZTextbox.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // positionYTextbox
            // 
            this.positionYTextbox.Location = new System.Drawing.Point(156, 67);
            this.positionYTextbox.Name = "positionYTextbox";
            this.positionYTextbox.Size = new System.Drawing.Size(55, 20);
            this.positionYTextbox.TabIndex = 8;
            this.positionYTextbox.Text = "Y";
            this.positionYTextbox.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // positionXTextbox
            // 
            this.positionXTextbox.Location = new System.Drawing.Point(95, 67);
            this.positionXTextbox.Name = "positionXTextbox";
            this.positionXTextbox.Size = new System.Drawing.Size(55, 20);
            this.positionXTextbox.TabIndex = 9;
            this.positionXTextbox.Text = "X";
            this.positionXTextbox.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // startButton
            // 
            this.startButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.startButton.Location = new System.Drawing.Point(12, 93);
            this.startButton.Name = "startButton";
            this.startButton.Size = new System.Drawing.Size(259, 44);
            this.startButton.TabIndex = 12;
            this.startButton.Text = "Start";
            this.startButton.UseVisualStyleBackColor = false;
            this.startButton.Click += new System.EventHandler(this.startButton_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 142);
            this.Controls.Add(this.startButton);
            this.Controls.Add(this.positionXTextbox);
            this.Controls.Add(this.positionYTextbox);
            this.Controls.Add(this.positionZTextbox);
            this.Controls.Add(this.positionLabel);
            this.Controls.Add(this.worldTextbox);
            this.Controls.Add(this.worldButton);
            this.Controls.Add(this.scriptButton);
            this.Controls.Add(this.scriptTextbox);
            this.Controls.Add(this.worldLabel);
            this.Controls.Add(this.scriptLabel);
            this.Name = "MainForm";
            this.Text = "CommandblocksJS GUI";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label scriptLabel;
        private System.Windows.Forms.Label worldLabel;
        private System.Windows.Forms.TextBox scriptTextbox;
        private System.Windows.Forms.Button scriptButton;
        private System.Windows.Forms.Button worldButton;
        private System.Windows.Forms.TextBox worldTextbox;
        private System.Windows.Forms.Label positionLabel;
        private System.Windows.Forms.TextBox positionZTextbox;
        private System.Windows.Forms.TextBox positionYTextbox;
        private System.Windows.Forms.TextBox positionXTextbox;
        private System.Windows.Forms.Button startButton;
    }
}


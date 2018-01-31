namespace CommonCtrl
{
    partial class FrmOptionTrade
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            this.dgv = new System.Windows.Forms.DataGridView();
            this.ColCode = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColPrice = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColDir = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColTotal = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColYestodayPos = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColTodayPos = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColAvgPrice = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColProfit = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabel1 = new System.Windows.Forms.ToolStripStatusLabel();
            this.toolStripStatusLabel2 = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblDynamicEquity = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.lblFrozenCapital = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.lblAvaiableCapital = new System.Windows.Forms.Label();
            this.dgvOrder = new System.Windows.Forms.DataGridView();
            this.ColOrderTime = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColOperate = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColStatus = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColTradeTime = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ColCancel = new System.Windows.Forms.DataGridViewLinkColumn();
            this.cbOfrAvailable = new System.Windows.Forms.CheckBox();
            this.cbLock = new System.Windows.Forms.CheckBox();
            this.ckbEnableMulti = new System.Windows.Forms.CheckBox();
            this.ckbOpen = new System.Windows.Forms.CheckBox();
            this.ckbClose = new System.Windows.Forms.CheckBox();
            this.pbPop = new System.Windows.Forms.PictureBox();
            this.groupBox = new System.Windows.Forms.GroupBox();
            this.btnLogin = new System.Windows.Forms.Button();
            this.btnLogout = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.dgv)).BeginInit();
            this.statusStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvOrder)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbPop)).BeginInit();
            this.groupBox.SuspendLayout();
            this.SuspendLayout();
            // 
            // dgv
            // 
            this.dgv.AllowUserToAddRows = false;
            this.dgv.AllowUserToDeleteRows = false;
            this.dgv.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgv.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.ColCode,
            this.ColPrice,
            this.ColDir,
            this.ColTotal,
            this.ColYestodayPos,
            this.ColTodayPos,
            this.ColAvgPrice,
            this.ColProfit});
            this.dgv.Location = new System.Drawing.Point(13, 40);
            this.dgv.Name = "dgv";
            this.dgv.ReadOnly = true;
            this.dgv.RowTemplate.Height = 23;
            this.dgv.Size = new System.Drawing.Size(524, 165);
            this.dgv.TabIndex = 1;
            this.dgv.RowEnter += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgv_RowEnter);
            // 
            // ColCode
            // 
            this.ColCode.HeaderText = "code";
            this.ColCode.Name = "ColCode";
            this.ColCode.ReadOnly = true;
            this.ColCode.Width = 60;
            // 
            // ColPrice
            // 
            this.ColPrice.HeaderText = "price";
            this.ColPrice.Name = "ColPrice";
            this.ColPrice.ReadOnly = true;
            this.ColPrice.Width = 60;
            // 
            // ColDir
            // 
            this.ColDir.HeaderText = "dir";
            this.ColDir.Name = "ColDir";
            this.ColDir.ReadOnly = true;
            this.ColDir.Width = 40;
            // 
            // ColTotal
            // 
            this.ColTotal.HeaderText = "total";
            this.ColTotal.Name = "ColTotal";
            this.ColTotal.ReadOnly = true;
            this.ColTotal.Width = 40;
            // 
            // ColYestodayPos
            // 
            this.ColYestodayPos.HeaderText = "yestoday";
            this.ColYestodayPos.Name = "ColYestodayPos";
            this.ColYestodayPos.ReadOnly = true;
            this.ColYestodayPos.Width = 40;
            // 
            // ColTodayPos
            // 
            this.ColTodayPos.HeaderText = "today";
            this.ColTodayPos.Name = "ColTodayPos";
            this.ColTodayPos.ReadOnly = true;
            this.ColTodayPos.Width = 40;
            // 
            // ColAvgPrice
            // 
            dataGridViewCellStyle1.Format = "N1";
            dataGridViewCellStyle1.NullValue = null;
            this.ColAvgPrice.DefaultCellStyle = dataGridViewCellStyle1;
            this.ColAvgPrice.HeaderText = "avgPrice";
            this.ColAvgPrice.Name = "ColAvgPrice";
            this.ColAvgPrice.ReadOnly = true;
            // 
            // ColProfit
            // 
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleRight;
            this.ColProfit.DefaultCellStyle = dataGridViewCellStyle2;
            this.ColProfit.HeaderText = "profit";
            this.ColProfit.Name = "ColProfit";
            this.ColProfit.ReadOnly = true;
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabel1,
            this.toolStripStatusLabel2});
            this.statusStrip1.Location = new System.Drawing.Point(0, 515);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(1061, 22);
            this.statusStrip1.TabIndex = 9;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // toolStripStatusLabel1
            // 
            this.toolStripStatusLabel1.Name = "toolStripStatusLabel1";
            this.toolStripStatusLabel1.Size = new System.Drawing.Size(131, 17);
            this.toolStripStatusLabel1.Text = "toolStripStatusLabel1";
            // 
            // toolStripStatusLabel2
            // 
            this.toolStripStatusLabel2.Name = "toolStripStatusLabel2";
            this.toolStripStatusLabel2.Size = new System.Drawing.Size(131, 17);
            this.toolStripStatusLabel2.Text = "toolStripStatusLabel2";
            // 
            // lblDynamicEquity
            // 
            this.lblDynamicEquity.AutoSize = true;
            this.lblDynamicEquity.Location = new System.Drawing.Point(112, 19);
            this.lblDynamicEquity.Name = "lblDynamicEquity";
            this.lblDynamicEquity.Size = new System.Drawing.Size(29, 12);
            this.lblDynamicEquity.TabIndex = 10;
            this.lblDynamicEquity.Text = "0000";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(14, 19);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(83, 12);
            this.label1.TabIndex = 11;
            this.label1.Text = "DynamicEquity";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(165, 19);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(83, 12);
            this.label2.TabIndex = 13;
            this.label2.Text = "FrozenCapital";
            // 
            // lblFrozenCapital
            // 
            this.lblFrozenCapital.AutoSize = true;
            this.lblFrozenCapital.Location = new System.Drawing.Point(263, 19);
            this.lblFrozenCapital.Name = "lblFrozenCapital";
            this.lblFrozenCapital.Size = new System.Drawing.Size(29, 12);
            this.lblFrozenCapital.TabIndex = 12;
            this.lblFrozenCapital.Text = "0000";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(330, 19);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(95, 12);
            this.label4.TabIndex = 15;
            this.label4.Text = "AvaiableCapital";
            // 
            // lblAvaiableCapital
            // 
            this.lblAvaiableCapital.AutoSize = true;
            this.lblAvaiableCapital.Location = new System.Drawing.Point(428, 19);
            this.lblAvaiableCapital.Name = "lblAvaiableCapital";
            this.lblAvaiableCapital.Size = new System.Drawing.Size(29, 12);
            this.lblAvaiableCapital.TabIndex = 14;
            this.lblAvaiableCapital.Text = "0000";
            // 
            // dgvOrder
            // 
            this.dgvOrder.AllowUserToAddRows = false;
            this.dgvOrder.AllowUserToDeleteRows = false;
            this.dgvOrder.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvOrder.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.ColOrderTime,
            this.dataGridViewTextBoxColumn1,
            this.dataGridViewTextBoxColumn2,
            this.dataGridViewTextBoxColumn3,
            this.ColOperate,
            this.ColStatus,
            this.ColTradeTime,
            this.ColCancel});
            this.dgvOrder.Location = new System.Drawing.Point(13, 211);
            this.dgvOrder.Name = "dgvOrder";
            this.dgvOrder.ReadOnly = true;
            this.dgvOrder.RowTemplate.Height = 23;
            this.dgvOrder.Size = new System.Drawing.Size(524, 255);
            this.dgvOrder.TabIndex = 16;
            this.dgvOrder.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvOrder_CellContentClick);
            // 
            // ColOrderTime
            // 
            this.ColOrderTime.HeaderText = "ordertime";
            this.ColOrderTime.Name = "ColOrderTime";
            this.ColOrderTime.ReadOnly = true;
            this.ColOrderTime.Width = 80;
            // 
            // dataGridViewTextBoxColumn1
            // 
            this.dataGridViewTextBoxColumn1.HeaderText = "code";
            this.dataGridViewTextBoxColumn1.Name = "dataGridViewTextBoxColumn1";
            this.dataGridViewTextBoxColumn1.ReadOnly = true;
            this.dataGridViewTextBoxColumn1.Width = 60;
            // 
            // dataGridViewTextBoxColumn2
            // 
            this.dataGridViewTextBoxColumn2.HeaderText = "price";
            this.dataGridViewTextBoxColumn2.Name = "dataGridViewTextBoxColumn2";
            this.dataGridViewTextBoxColumn2.ReadOnly = true;
            this.dataGridViewTextBoxColumn2.Width = 60;
            // 
            // dataGridViewTextBoxColumn3
            // 
            this.dataGridViewTextBoxColumn3.HeaderText = "direction";
            this.dataGridViewTextBoxColumn3.Name = "dataGridViewTextBoxColumn3";
            this.dataGridViewTextBoxColumn3.ReadOnly = true;
            this.dataGridViewTextBoxColumn3.Width = 40;
            // 
            // ColOperate
            // 
            this.ColOperate.HeaderText = "operate";
            this.ColOperate.Name = "ColOperate";
            this.ColOperate.ReadOnly = true;
            this.ColOperate.Width = 60;
            // 
            // ColStatus
            // 
            this.ColStatus.HeaderText = "status";
            this.ColStatus.Name = "ColStatus";
            this.ColStatus.ReadOnly = true;
            this.ColStatus.Width = 60;
            // 
            // ColTradeTime
            // 
            this.ColTradeTime.HeaderText = "tradetime";
            this.ColTradeTime.Name = "ColTradeTime";
            this.ColTradeTime.ReadOnly = true;
            this.ColTradeTime.Width = 80;
            // 
            // ColCancel
            // 
            this.ColCancel.HeaderText = "cancel";
            this.ColCancel.Name = "ColCancel";
            this.ColCancel.ReadOnly = true;
            this.ColCancel.Width = 60;
            // 
            // cbOfrAvailable
            // 
            this.cbOfrAvailable.AutoSize = true;
            this.cbOfrAvailable.Location = new System.Drawing.Point(540, 20);
            this.cbOfrAvailable.Name = "cbOfrAvailable";
            this.cbOfrAvailable.Size = new System.Drawing.Size(126, 16);
            this.cbOfrAvailable.TabIndex = 20;
            this.cbOfrAvailable.Text = "Enable sell first";
            this.cbOfrAvailable.UseVisualStyleBackColor = true;
            this.cbOfrAvailable.CheckedChanged += new System.EventHandler(this.cbOfrAvailable_CheckedChanged);
            // 
            // cbLock
            // 
            this.cbLock.AutoSize = true;
            this.cbLock.Location = new System.Drawing.Point(921, 7);
            this.cbLock.Name = "cbLock";
            this.cbLock.Size = new System.Drawing.Size(90, 16);
            this.cbLock.TabIndex = 21;
            this.cbLock.Text = "Lock screen";
            this.cbLock.UseVisualStyleBackColor = true;
            this.cbLock.CheckedChanged += new System.EventHandler(this.cbLock_CheckedChanged);
            // 
            // ckbEnableMulti
            // 
            this.ckbEnableMulti.AutoSize = true;
            this.ckbEnableMulti.Location = new System.Drawing.Point(666, 19);
            this.ckbEnableMulti.Name = "ckbEnableMulti";
            this.ckbEnableMulti.Size = new System.Drawing.Size(162, 16);
            this.ckbEnableMulti.TabIndex = 22;
            this.ckbEnableMulti.Text = "No limited net position";
            this.ckbEnableMulti.UseVisualStyleBackColor = true;
            // 
            // ckbOpen
            // 
            this.ckbOpen.AutoSize = true;
            this.ckbOpen.Location = new System.Drawing.Point(827, 19);
            this.ckbOpen.Name = "ckbOpen";
            this.ckbOpen.Size = new System.Drawing.Size(48, 16);
            this.ckbOpen.TabIndex = 23;
            this.ckbOpen.Text = "Open";
            this.ckbOpen.UseVisualStyleBackColor = true;
            this.ckbOpen.CheckedChanged += new System.EventHandler(this.ckbOpen_CheckedChanged);
            // 
            // ckbClose
            // 
            this.ckbClose.AutoSize = true;
            this.ckbClose.Location = new System.Drawing.Point(894, 19);
            this.ckbClose.Name = "ckbClose";
            this.ckbClose.Size = new System.Drawing.Size(54, 16);
            this.ckbClose.TabIndex = 24;
            this.ckbClose.Text = "Close";
            this.ckbClose.UseVisualStyleBackColor = true;
            this.ckbClose.CheckedChanged += new System.EventHandler(this.ckbClose_CheckedChanged);
            // 
            // pbPop
            // 
            this.pbPop.Location = new System.Drawing.Point(3, 1);
            this.pbPop.Name = "pbPop";
            this.pbPop.Size = new System.Drawing.Size(24, 22);
            this.pbPop.TabIndex = 25;
            this.pbPop.TabStop = false;
            this.pbPop.Click += new System.EventHandler(this.pbPop_Click);
            // 
            // groupBox
            // 
            this.groupBox.Controls.Add(this.dgv);
            this.groupBox.Controls.Add(this.lblDynamicEquity);
            this.groupBox.Controls.Add(this.ckbClose);
            this.groupBox.Controls.Add(this.label1);
            this.groupBox.Controls.Add(this.ckbOpen);
            this.groupBox.Controls.Add(this.lblFrozenCapital);
            this.groupBox.Controls.Add(this.ckbEnableMulti);
            this.groupBox.Controls.Add(this.label2);
            this.groupBox.Controls.Add(this.lblAvaiableCapital);
            this.groupBox.Controls.Add(this.cbOfrAvailable);
            this.groupBox.Controls.Add(this.label4);
            this.groupBox.Controls.Add(this.dgvOrder);
            this.groupBox.Location = new System.Drawing.Point(24, 22);
            this.groupBox.Name = "groupBox";
            this.groupBox.Padding = new System.Windows.Forms.Padding(0, 0, 3, 3);
            this.groupBox.Size = new System.Drawing.Size(1007, 490);
            this.groupBox.TabIndex = 26;
            this.groupBox.TabStop = false;
            // 
            // btnLogin
            // 
            this.btnLogin.Location = new System.Drawing.Point(93, 1);
            this.btnLogin.Name = "btnLogin";
            this.btnLogin.Size = new System.Drawing.Size(75, 23);
            this.btnLogin.TabIndex = 27;
            this.btnLogin.Text = "Login";
            this.btnLogin.UseVisualStyleBackColor = true;
            this.btnLogin.Click += new System.EventHandler(this.btnLogin_Click);
            // 
            // btnLogout
            // 
            this.btnLogout.Location = new System.Drawing.Point(191, 1);
            this.btnLogout.Name = "btnLogout";
            this.btnLogout.Size = new System.Drawing.Size(75, 23);
            this.btnLogout.TabIndex = 28;
            this.btnLogout.Text = "Logout";
            this.btnLogout.UseVisualStyleBackColor = true;
            this.btnLogout.Click += new System.EventHandler(this.btnLogout_Click);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(289, 0);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 29;
            this.button1.Text = "Test";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // FrmOptionTrade
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1061, 537);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.btnLogout);
            this.Controls.Add(this.btnLogin);
            this.Controls.Add(this.groupBox);
            this.Controls.Add(this.pbPop);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.cbLock);
            this.Name = "FrmOptionTrade";
            this.Text = "Test";
            this.Activated += new System.EventHandler(this.Form1_Activated);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Form1_FormClosing);
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ParentChanged += new System.EventHandler(this.FrmOptionTrade_ParentChanged);
            ((System.ComponentModel.ISupportInitialize)(this.dgv)).EndInit();
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvOrder)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbPop)).EndInit();
            this.groupBox.ResumeLayout(false);
            this.groupBox.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView dgv;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel1;
        private System.Windows.Forms.Label lblDynamicEquity;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label lblFrozenCapital;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label lblAvaiableCapital;
        private System.Windows.Forms.DataGridView dgvOrder;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColCode;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColPrice;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColDir;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColTotal;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColYestodayPos;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColTodayPos;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColAvgPrice;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColProfit;
        private System.Windows.Forms.CheckBox cbOfrAvailable;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColOrderTime;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn2;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn3;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColOperate;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColStatus;
        private System.Windows.Forms.DataGridViewTextBoxColumn ColTradeTime;
        private System.Windows.Forms.DataGridViewLinkColumn ColCancel;
        private System.Windows.Forms.CheckBox cbLock;
        private System.Windows.Forms.CheckBox ckbEnableMulti;
        private System.Windows.Forms.CheckBox ckbOpen;
        private System.Windows.Forms.CheckBox ckbClose;
        private System.Windows.Forms.PictureBox pbPop;
        private System.Windows.Forms.GroupBox groupBox;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel2;
        private System.Windows.Forms.Button btnLogin;
        private System.Windows.Forms.Button btnLogout;
        private System.Windows.Forms.Button button1;
    }
}


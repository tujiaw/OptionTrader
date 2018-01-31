namespace CommonCtrl
{
    partial class CtlOrder
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

        #region 组件设计器生成的代码

        /// <summary> 
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.tbPrice = new System.Windows.Forms.TextBox();
            this.lblBidPrice = new System.Windows.Forms.Label();
            this.lblAskPrice = new System.Windows.Forms.Label();
            this.btnSell = new System.Windows.Forms.Button();
            this.btnBuy = new System.Windows.Forms.Button();
            this.lblCode = new System.Windows.Forms.Label();
            this.lblAskVolume = new System.Windows.Forms.Label();
            this.lblBidVolume = new System.Windows.Forms.Label();
            this.btnUp = new System.Windows.Forms.Button();
            this.btnDown = new System.Windows.Forms.Button();
            this.lblPrice = new System.Windows.Forms.Label();
            this.lblIndex = new System.Windows.Forms.Label();
            this.lblGap = new System.Windows.Forms.Label();
            this.btnCancel = new System.Windows.Forms.Button();
            this.lblLock = new System.Windows.Forms.Label();
            this.lblStatus = new System.Windows.Forms.Label();
            this.btnDowndown = new System.Windows.Forms.Button();
            this.btnUpup = new System.Windows.Forms.Button();
            this.lblBuy = new System.Windows.Forms.Label();
            this.lblSell = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // tbPrice
            // 
            this.tbPrice.Location = new System.Drawing.Point(282, 58);
            this.tbPrice.Margin = new System.Windows.Forms.Padding(6);
            this.tbPrice.Name = "tbPrice";
            this.tbPrice.Size = new System.Drawing.Size(252, 35);
            this.tbPrice.TabIndex = 13;
            // 
            // lblBidPrice
            // 
            this.lblBidPrice.AutoSize = true;
            this.lblBidPrice.Location = new System.Drawing.Point(28, 106);
            this.lblBidPrice.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblBidPrice.Name = "lblBidPrice";
            this.lblBidPrice.Size = new System.Drawing.Size(58, 24);
            this.lblBidPrice.TabIndex = 12;
            this.lblBidPrice.Text = "0000";
            this.lblBidPrice.Click += new System.EventHandler(this.lblBidPrice_Click);
            // 
            // lblAskPrice
            // 
            this.lblAskPrice.AutoSize = true;
            this.lblAskPrice.Location = new System.Drawing.Point(28, 58);
            this.lblAskPrice.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblAskPrice.Name = "lblAskPrice";
            this.lblAskPrice.Size = new System.Drawing.Size(58, 24);
            this.lblAskPrice.TabIndex = 11;
            this.lblAskPrice.Text = "0000";
            this.lblAskPrice.Click += new System.EventHandler(this.lblAskPrice_Click);
            // 
            // btnSell
            // 
            this.btnSell.Location = new System.Drawing.Point(204, 160);
            this.btnSell.Margin = new System.Windows.Forms.Padding(6);
            this.btnSell.Name = "btnSell";
            this.btnSell.Size = new System.Drawing.Size(168, 92);
            this.btnSell.TabIndex = 10;
            this.btnSell.Text = "OFR";
            this.btnSell.UseVisualStyleBackColor = true;
            this.btnSell.Click += new System.EventHandler(this.btnSell_Click);
            // 
            // btnBuy
            // 
            this.btnBuy.Location = new System.Drawing.Point(12, 160);
            this.btnBuy.Margin = new System.Windows.Forms.Padding(6);
            this.btnBuy.Name = "btnBuy";
            this.btnBuy.Size = new System.Drawing.Size(180, 92);
            this.btnBuy.TabIndex = 9;
            this.btnBuy.Text = "BID";
            this.btnBuy.UseVisualStyleBackColor = true;
            this.btnBuy.Click += new System.EventHandler(this.btnBuy_Click);
            // 
            // lblCode
            // 
            this.lblCode.AutoSize = true;
            this.lblCode.Location = new System.Drawing.Point(8, 8);
            this.lblCode.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblCode.Name = "lblCode";
            this.lblCode.Size = new System.Drawing.Size(82, 24);
            this.lblCode.TabIndex = 14;
            this.lblCode.Text = "000000";
            // 
            // lblAskVolume
            // 
            this.lblAskVolume.AutoSize = true;
            this.lblAskVolume.Location = new System.Drawing.Point(134, 58);
            this.lblAskVolume.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblAskVolume.Name = "lblAskVolume";
            this.lblAskVolume.Size = new System.Drawing.Size(22, 24);
            this.lblAskVolume.TabIndex = 15;
            this.lblAskVolume.Text = "0";
            // 
            // lblBidVolume
            // 
            this.lblBidVolume.AutoSize = true;
            this.lblBidVolume.Location = new System.Drawing.Point(134, 106);
            this.lblBidVolume.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblBidVolume.Name = "lblBidVolume";
            this.lblBidVolume.Size = new System.Drawing.Size(22, 24);
            this.lblBidVolume.TabIndex = 16;
            this.lblBidVolume.Text = "0";
            // 
            // btnUp
            // 
            this.btnUp.Location = new System.Drawing.Point(282, 106);
            this.btnUp.Margin = new System.Windows.Forms.Padding(6);
            this.btnUp.Name = "btnUp";
            this.btnUp.Size = new System.Drawing.Size(56, 46);
            this.btnUp.TabIndex = 17;
            this.btnUp.Text = "+";
            this.btnUp.UseVisualStyleBackColor = true;
            this.btnUp.Click += new System.EventHandler(this.btnUp_Click);
            // 
            // btnDown
            // 
            this.btnDown.Location = new System.Drawing.Point(350, 106);
            this.btnDown.Margin = new System.Windows.Forms.Padding(6);
            this.btnDown.Name = "btnDown";
            this.btnDown.Size = new System.Drawing.Size(52, 46);
            this.btnDown.TabIndex = 18;
            this.btnDown.Text = "-";
            this.btnDown.UseVisualStyleBackColor = true;
            this.btnDown.Click += new System.EventHandler(this.btnDown_Click);
            // 
            // lblPrice
            // 
            this.lblPrice.AutoSize = true;
            this.lblPrice.Location = new System.Drawing.Point(182, 76);
            this.lblPrice.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblPrice.Name = "lblPrice";
            this.lblPrice.Size = new System.Drawing.Size(70, 24);
            this.lblPrice.TabIndex = 19;
            this.lblPrice.Text = "00000";
            this.lblPrice.Click += new System.EventHandler(this.lblPrice_Click);
            // 
            // lblIndex
            // 
            this.lblIndex.AutoSize = true;
            this.lblIndex.Location = new System.Drawing.Point(120, 8);
            this.lblIndex.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblIndex.Name = "lblIndex";
            this.lblIndex.Size = new System.Drawing.Size(70, 24);
            this.lblIndex.TabIndex = 20;
            this.lblIndex.Text = "00000";
            // 
            // lblGap
            // 
            this.lblGap.AutoSize = true;
            this.lblGap.Location = new System.Drawing.Point(200, 8);
            this.lblGap.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblGap.Name = "lblGap";
            this.lblGap.Size = new System.Drawing.Size(34, 24);
            this.lblGap.TabIndex = 21;
            this.lblGap.Text = "00";
            // 
            // btnCancel
            // 
            this.btnCancel.Enabled = false;
            this.btnCancel.Location = new System.Drawing.Point(384, 160);
            this.btnCancel.Margin = new System.Windows.Forms.Padding(6);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(150, 92);
            this.btnCancel.TabIndex = 22;
            this.btnCancel.Text = "X";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // lblLock
            // 
            this.lblLock.AutoSize = true;
            this.lblLock.Location = new System.Drawing.Point(512, 8);
            this.lblLock.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblLock.Name = "lblLock";
            this.lblLock.Size = new System.Drawing.Size(22, 24);
            this.lblLock.TabIndex = 23;
            this.lblLock.Text = "L";
            this.lblLock.Click += new System.EventHandler(this.label1_Click);
            // 
            // lblStatus
            // 
            this.lblStatus.Font = new System.Drawing.Font("SimSun", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblStatus.Location = new System.Drawing.Point(8, 254);
            this.lblStatus.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(526, 24);
            this.lblStatus.TabIndex = 24;
            // 
            // btnDowndown
            // 
            this.btnDowndown.Location = new System.Drawing.Point(482, 106);
            this.btnDowndown.Margin = new System.Windows.Forms.Padding(6);
            this.btnDowndown.Name = "btnDowndown";
            this.btnDowndown.Size = new System.Drawing.Size(52, 46);
            this.btnDowndown.TabIndex = 26;
            this.btnDowndown.Text = "--";
            this.btnDowndown.UseVisualStyleBackColor = true;
            this.btnDowndown.Click += new System.EventHandler(this.btnDowndown_Click);
            // 
            // btnUpup
            // 
            this.btnUpup.Location = new System.Drawing.Point(414, 106);
            this.btnUpup.Margin = new System.Windows.Forms.Padding(6);
            this.btnUpup.Name = "btnUpup";
            this.btnUpup.Size = new System.Drawing.Size(56, 46);
            this.btnUpup.TabIndex = 25;
            this.btnUpup.Text = "++";
            this.btnUpup.UseVisualStyleBackColor = true;
            this.btnUpup.Click += new System.EventHandler(this.btnUpup_Click);
            // 
            // lblBuy
            // 
            this.lblBuy.AutoSize = true;
            this.lblBuy.Location = new System.Drawing.Point(298, 8);
            this.lblBuy.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblBuy.Name = "lblBuy";
            this.lblBuy.Size = new System.Drawing.Size(22, 24);
            this.lblBuy.TabIndex = 27;
            this.lblBuy.Text = "0";
            // 
            // lblSell
            // 
            this.lblSell.AutoSize = true;
            this.lblSell.Location = new System.Drawing.Point(376, 8);
            this.lblSell.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblSell.Name = "lblSell";
            this.lblSell.Size = new System.Drawing.Size(22, 24);
            this.lblSell.TabIndex = 28;
            this.lblSell.Text = "0";
            // 
            // CtlOrder
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 24F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.lblSell);
            this.Controls.Add(this.lblBuy);
            this.Controls.Add(this.btnDowndown);
            this.Controls.Add(this.btnUpup);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.lblLock);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.lblGap);
            this.Controls.Add(this.lblIndex);
            this.Controls.Add(this.lblPrice);
            this.Controls.Add(this.btnDown);
            this.Controls.Add(this.btnUp);
            this.Controls.Add(this.lblBidVolume);
            this.Controls.Add(this.lblAskVolume);
            this.Controls.Add(this.lblCode);
            this.Controls.Add(this.tbPrice);
            this.Controls.Add(this.lblBidPrice);
            this.Controls.Add(this.lblAskPrice);
            this.Controls.Add(this.btnSell);
            this.Controls.Add(this.btnBuy);
            this.Margin = new System.Windows.Forms.Padding(6);
            this.Name = "CtlOrder";
            this.Size = new System.Drawing.Size(542, 278);
            this.Load += new System.EventHandler(this.CtlOrder_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox tbPrice;
        private System.Windows.Forms.Label lblBidPrice;
        private System.Windows.Forms.Label lblAskPrice;
        private System.Windows.Forms.Button btnSell;
        private System.Windows.Forms.Button btnBuy;
        private System.Windows.Forms.Label lblCode;
        private System.Windows.Forms.Label lblAskVolume;
        private System.Windows.Forms.Label lblBidVolume;
        private System.Windows.Forms.Button btnUp;
        private System.Windows.Forms.Button btnDown;
        private System.Windows.Forms.Label lblPrice;
        private System.Windows.Forms.Label lblIndex;
        private System.Windows.Forms.Label lblGap;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Label lblLock;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Button btnDowndown;
        private System.Windows.Forms.Button btnUpup;
        private System.Windows.Forms.Label lblBuy;
        private System.Windows.Forms.Label lblSell;
    }
}

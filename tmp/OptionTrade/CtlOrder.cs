using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Collections;

namespace CommonCtrl
{
    public partial class CtlOrder : UserControl
    {
        private Hashtable htbl = new Hashtable() { { "IC", "sz399905" }, { "IF", "sh000300" }, { "IH", "sh000016" } };
        private Hashtable hashOrder = new Hashtable();
        private int buyPos = 0;
        private int sellPos = 0;
        public delegate void DelegateOrder(string code,double price);

        public string Code { set; get; }
        public DelegateOrder Bid { set; get; }
        public DelegateOrder Ofr { set; get; }
        public DelegateOrder Cancel { set; get; }
        public void OnQuote(string code,Trade.MarketData data)
        {
            if (code.Equals(Code))
            {
                lblAskPrice.Text = data.DAskPrice1.ToString();
                lblBidPrice.Text = data.DBidPrice1.ToString();
                lblAskVolume.Text = data.NAskVolume1.ToString();
                lblBidVolume.Text = data.NBidVolume1.ToString();
                lblPrice.Text = data.DLastPrice.ToString();
                UpdateGap();
            }
        }
        public void OnTrade(string code, Trade.Trade trade)
        {
            if (code.Equals(Code))
            {
                enTradeDir dir = (enTradeDir)trade.NTradeDir;
                enTradeOperate operate = (enTradeOperate)trade.NTradeOperate;
                lblStatus.Text = "Trade:{ " + code + "   " + (dir==enTradeDir.TRADE_DIR_BUY?"Buy":"Sell" ) + (operate==enTradeOperate.TRADE_OPERATE_OPEN?"Open":"Close") + "   "+trade.DPrice+"}";
                if (hashOrder.Contains(code))
                {
                    hashOrder.Remove(code);
                    btnCancel.Enabled = false;
                }
            }
        }
        public void OnOrder(string code, Trade.Order order)
        {
            if (code.Equals(Code))
            {
                enTradeOrderStatus status = (enTradeOrderStatus)order.NOrderStatus;
                string strStatus = "wait";
                if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_TRADED)
                    strStatus = "traded";
                else if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_CANCELED)
                    strStatus = "cancel";
                enTradeDir dir =(enTradeDir) order.NTradeDir;
                enTradeOperate operate =(enTradeOperate) order.NTradeOperate;
                lblStatus.Text = "Order:{ " + code + "   " + (dir == enTradeDir.TRADE_DIR_BUY ? "Buy" : "Sell") + (operate == enTradeOperate.TRADE_OPERATE_OPEN ? "Open" : "Close") + "   " + order.DLimitPrice + "   " + strStatus + "}";
                if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT)
                {
                    btnCancel.Enabled = true;
                    hashOrder[code]= order.NOrderID;
                }
                else
                    btnCancel.Enabled = false;
            }
        }
        public void OnIndex(string code, HQData data)
        {
            string key = Code.Substring(0, 2);
            if (!htbl.ContainsKey(key))
                return;
            if (code.Equals(htbl[key]))
            {
                lblIndex.Text = data.Close.ToString("f2");
                UpdateGap();
            }
        }
        public void OnPosition(string code, Trade.Position pos)
        {
            if (code.Equals(Code))
            {
                if (pos.NTradeDir == (int)enTradeDir.TRADE_DIR_BUY)
                {
                    lblBuy.Text = "Buy:" + pos.NPosition;
                    buyPos = pos.NPosition;
                }
                else
                {
                    lblSell.Text = "Sell:" + pos.NPosition;
                    sellPos = pos.NPosition;
                }
            }
        }
        private void UpdateGap()
        {
            float optionPrice = 0.0f;
            float indexPrice = 0.0f;
            if (!float.TryParse(lblPrice.Text, out optionPrice))
                return;
            if (!float.TryParse(lblIndex.Text, out indexPrice))
                return;
            if (optionPrice < 1.0f || indexPrice < 1.0f)
                return;
            int gap=(int)(optionPrice-indexPrice);
            lblGap.Text = gap.ToString();
            if (gap > 0)
                lblGap.ForeColor = Color.Red;
            else
                lblGap.ForeColor = Color.Blue;
               
        }

        public CtlOrder()
        {
            InitializeComponent();
        }

        private void CtlOrder_Load(object sender, EventArgs e)
        {
            lblCode.Text = Code;
            btnBuy.Text = "B " + Code;
            btnSell.Text = "S " + Code;
        }

        private void lblBidPrice_Click(object sender, EventArgs e)
        {
            tbPrice.Text = lblBidPrice.Text;
        }

        private void lblAskPrice_Click(object sender, EventArgs e)
        {
            tbPrice.Text = lblAskPrice.Text;
        }

        private void lblPrice_Click(object sender, EventArgs e)
        {
            tbPrice.Text = lblAskPrice.Text;
        }

        private void btnBuy_Click(object sender, EventArgs e)
        {
            if (buyPos - sellPos > 0)
            {
                if (MessageBox.Show("仓位重，确定要继续吗？", "警告", MessageBoxButtons.YesNo) == DialogResult.No)
                    return;
            }
            double price = 0.0;
            if (tbPrice.Text.Trim().Length > 0)
                Double.TryParse(tbPrice.Text.Trim(), out price);
            else if(lblAskPrice.Text.Trim().Length > 0)
                Double.TryParse(lblAskPrice.Text.Trim(), out price);
            Bid(Code, price);
        }

        private void btnSell_Click(object sender, EventArgs e)
        {
            if (sellPos - buyPos > 0)
            {
                if (MessageBox.Show("仓位重，确定要继续吗？", "警告", MessageBoxButtons.YesNo) == DialogResult.No)
                    return;
            }
            double price = 0.0;
            if (tbPrice.Text.Trim().Length > 0)
                Double.TryParse(tbPrice.Text.Trim(), out price);
            else if (lblAskPrice.Text.Trim().Length > 0)
                Double.TryParse(lblBidPrice.Text.Trim(), out price);
            Ofr(Code, price);
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            if (Cancel != null)
                Cancel(Code, 0);
        }

        private void btnUp_Click(object sender, EventArgs e)
        {
            string strPrice = tbPrice.Text.Trim();
            if (strPrice.Length == 0)
                strPrice = lblPrice.Text.Trim();
            double price = 0.0;
            if (Double.TryParse(strPrice, out price))
            {
                price += 0.2;
                tbPrice.Text = price.ToString("f1");
            }
        }

        private void btnDown_Click(object sender, EventArgs e)
        {
            string strPrice = tbPrice.Text.Trim();
            if (strPrice.Length == 0)
                strPrice = lblPrice.Text.Trim();
            double price = 0.0;
            if (Double.TryParse(strPrice, out price))
            {
                price -= 0.2;
                tbPrice.Text = price.ToString("f1");
            }
        }

        private void btnUpup_Click(object sender, EventArgs e)
        {
            string strPrice = tbPrice.Text.Trim();
            if (strPrice.Length == 0)
                strPrice = lblPrice.Text.Trim();
            double price = 0.0;
            if (Double.TryParse(strPrice, out price))
            {
                price += 1.0;
                tbPrice.Text = price.ToString("f1");
            }
        }

        private void btnDowndown_Click(object sender, EventArgs e)
        {
            string strPrice = tbPrice.Text.Trim();
            if (strPrice.Length == 0)
                strPrice = lblPrice.Text.Trim();
            double price = 0.0;
            if (Double.TryParse(strPrice, out price))
            {
                price -= 1.0;
                tbPrice.Text = price.ToString("f1");
            }
        } 

        private void label1_Click(object sender, EventArgs e)
        {
            if (btnBuy.Enabled)
            {
                btnBuy.Enabled = false;
                btnSell.Enabled = false;
                btnCancel.Enabled = false;
            }
            else
            {
                btnBuy.Enabled = true;
                btnSell.Enabled = true;
                btnCancel.Enabled = true;
            }
        }

        
    }
}

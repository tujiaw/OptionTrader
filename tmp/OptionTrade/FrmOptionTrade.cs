using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.IO;
using BaseStructure;
using MsgExpress;
using MsgExpress.databus;

namespace CommonCtrl
{

    public partial class FrmOptionTrade : Form
    {
        private Hashtable htQuote = new Hashtable();
        private Hashtable htPosition = new Hashtable();
        private Hashtable htOrder = new Hashtable();
        private Hashtable htTrade = new Hashtable();
        private bool finished = false;
        private CtlOrder[] ctlOrderUI;
        public DataBusManager bus { set; get; }
        DataCenter datacenter = DataCenter.GetInatance();
        private string[] codes = new string[3] { "sz399905", "sh000300", "sh000016" };
        public FrmOptionTrade()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string[] arrCodes = File.ReadAllLines(@"Codelist.txt");
            if (arrCodes.Length < 1)
                return;
            ctlOrderUI = new CtlOrder[arrCodes.Length];
            for (int i = 0; i < arrCodes.Length; i++)
            {
                ctlOrderUI[i] = new CtlOrder();
                ctlOrderUI[i].Code = arrCodes[i];
                ctlOrderUI[i].Bid = new CtlOrder.DelegateOrder(Bid);
                ctlOrderUI[i].Ofr = new CtlOrder.DelegateOrder(Ofr);
                ctlOrderUI[i].Cancel = new CtlOrder.DelegateOrder(Cancel);
                ctlOrderUI[i].DoubleClick += new System.EventHandler(this.CtlOrder_DoubleClick);
                ctlOrderUI[i].MouseMove += new System.Windows.Forms.MouseEventHandler(this.FrmOptionTrade_MouseMove);
                ctlOrderUI[i].MouseUp += new System.Windows.Forms.MouseEventHandler(this.FrmOptionTrade_MouseUp);
                ctlOrderUI[i].MouseDown+= new System.Windows.Forms.MouseEventHandler(this.FrmOptionTrade_MouseDown);
                this.groupBox.Controls.Add(ctlOrderUI[i]);
                ctlOrderUI[i].Left = 540 + (i / 3) * (ctlOrderUI[i].Width+1);
                ctlOrderUI[i].Top = 45 + (i%3) * (ctlOrderUI[i].Height+1);
                ctlOrderUI[i].BorderStyle = BorderStyle.FixedSingle;
            }

            datacenter.AddCode(codes, true);

            datacenter.DataUpdated += new DataEventHandler(DataArrived);
            datacenter.PublishUpdated += new PublishHandler(PublishArrived);
        }
        private bool isSmall = false;
        private void CtlOrder_DoubleClick(object sender, EventArgs e)
        {
            CtlOrder ctl = sender as CtlOrder;
            if (isSmall)
            {
                this.FormBorderStyle = FormBorderStyle.Sizable;
                groupBox.Top = 10;
                groupBox.Left = 10;
                this.Width = groupBox.Width+30;
                this.Height = groupBox.Height+30;
                this.TopMost = false;
                isSmall = false;
            }
            else
            {
                this.FormBorderStyle = FormBorderStyle.None;
                groupBox.Top = -ctl.Top;
                groupBox.Left = -ctl.Left;
                this.Width = ctl.Width;
                this.Height = ctl.Height;
                this.TopMost = true;
                isSmall = true;
            }
        }
        System.Drawing.Point mouse_offset;
        private void FrmOptionTrade_MouseDown(object sender, MouseEventArgs e)
        {
            mouse_offset = new System.Drawing.Point(-e.X, -e.Y);
        }
        private void FrmOptionTrade_MouseMove(object sender, MouseEventArgs e)
        {
            if (isSmall && e.Button == MouseButtons.Left)
            {
                System.Drawing.Point mousePos = Control.MousePosition;
                mousePos.Offset(mouse_offset.X, mouse_offset.Y);
                Location = mousePos;
            }
        }

        private void FrmOptionTrade_MouseUp(object sender, MouseEventArgs e)
        {

        }

   
        private string getKey(string code, enTradeDir dir)
        {
            return code + ":" + dir;
        }

        private void PublishArrived(object sender, object e)
        {
            if (e is Trade.TradingAccount)
            {
                Trade.TradingAccount account = e as Trade.TradingAccount;
                accountcb(account);
            }
            else if (e is Trade.Order)
            {
                Trade.Order order = e as Trade.Order;
                ordercb(order);
            }
            else if (e is Trade.Trade)
            {
                Trade.Trade trade = e as Trade.Trade;
                tradecb(trade);
            }
            else if (e is Trade.MarketData)
            {
                Trade.MarketData data = e as Trade.MarketData;
                quotecb(data);
            }
            else if (e is Trade.Position)
            {
                Trade.Position pos = e as Trade.Position;
                positioncb(pos,false);
            }
            else if (e is Trade.ErrorInfo)
            {
                Trade.ErrorInfo err = e as Trade.ErrorInfo;
                errorcb(err.NRequestID);
            }
        }

        public delegate void DelegateAccount(Trade.TradingAccount account);
        public void OnAccount(Trade.TradingAccount account)
        {
            lblDynamicEquity.Text = account.DDynamicEquity.ToString("f0") ;
            lblFrozenCapital.Text = account.DFrozenCapital.ToString("f0");
            lblAvaiableCapital.Text = account.DAvaiableCapital.ToString("f0");
        }
        public void accountcb(Trade.TradingAccount account)
        {
            this.BeginInvoke(new DelegateAccount(OnAccount), new object[] { account });
        }
        double GetPrice(String code)
        {
            if (code.StartsWith("IF") || code.StartsWith("IH"))
                return 300.0;
            else if (code.StartsWith("IC"))
                return 200.0;
            return 0;
        }
        public delegate void DelegateQuote(String code);
        public void OnQuote(String code)
        {
            Trade.MarketData data = (Trade.MarketData)htQuote[code];
            string time = data.SzUpdateTime;
            toolStripStatusLabel1.Text = time;
            string key0 = getKey(code, enTradeDir.TRADE_DIR_BUY);
            string key1 = getKey(code, enTradeDir.TRADE_DIR_SELL);
            Trade.Position pos0=(new Trade.Position.Builder()).Build();
            Trade.Position pos1=(new Trade.Position.Builder()).Build();
            if (htPosition.ContainsKey(key0))
            {
                pos0 = (Trade.Position)htPosition[key0];
            }
            if (htPosition.ContainsKey(key1))
            {
                pos1 = (Trade.Position)htPosition[key1];
            }

            for (int i = 0; i < dgv.Rows.Count; i++)
            {
                if (dgv.Rows[i].Tag.ToString().Equals(key0))
                {
                    dgv.Rows[i].Cells[1].Value = data.DLastPrice;
                    double profit = (data.DLastPrice - pos0.DAvgPrice / GetPrice(code) / pos0.NPosition) * pos0.NPosition;
                    dgv.Rows[i].Cells[7].Value = profit.ToString("f0");
                }
                else if (dgv.Rows[i].Tag.ToString().Equals(key1))
                {
                    dgv.Rows[i].Cells[1].Value = data.DLastPrice;
                    double profit = (pos1.DAvgPrice / GetPrice(code) / pos0.NPosition - data.DLastPrice) * pos1.NPosition;
                    dgv.Rows[i].Cells[7].Value = profit.ToString("f0");
                }
            }
            foreach (CtlOrder ctl in ctlOrderUI)
                ctl.OnQuote(code, data);
        }
        public void quotecb(Trade.MarketData data)
        {
            string code = data.SzINSTRUMENT;
            double price = data.DLastPrice;
            htQuote[code] = data;
            this.BeginInvoke(new DelegateQuote(OnQuote), new object[] { code });
        }
        public delegate void DelegateUpdatePositionRow(string code, Trade.Position pos);
        public void UpdatePositionRow(string code, Trade.Position pos)
        {
            string key = getKey(code, (enTradeDir)pos.NTradeDir);
            int rowid = -1;
            for (int i = 0; i < dgv.Rows.Count; i++)
            {
                if (dgv.Rows[i].Tag.ToString().Equals(key))
                {
                    rowid = i;
                    break;
                }
            }
            if (rowid < 0)
            {
                rowid = dgv.Rows.Add(code);
                dgv.Rows[rowid].Tag = key;
            }
            string dir = "";
            if (pos.NTradeDir == 0)
                dir = "多";
            else
                dir = "空";
            double avgPrice = pos.DAvgPrice;
            if (code.Contains("IC"))
                avgPrice /= 200;
            else
                avgPrice /= 300;
            avgPrice /= pos.NPosition;
            string[] arr = { code, "", dir, pos.NPosition.ToString(), pos.NYesterdayPosition.ToString(), pos.NTodayPosition.ToString(), avgPrice.ToString("f1"), pos.DPositionProfit.ToString() };
            dgv.Rows[rowid].SetValues(arr);
        }
        public delegate void DelegatePosition(string key, bool bLast);
        public void OnPosition(string key, bool bLast)
        {
            Trade.Position pos = (Trade.Position)htPosition[key];
            string code = pos.SzINSTRUMENT;
            UpdatePositionRow(code, pos);
            finished = true;
            Console.WriteLine("OnPosition:"+pos.ToString());
        }
        public void positioncb(Trade.Position pos, bool bLast)
        {
            string code = pos.SzINSTRUMENT;
            string key = getKey(code, (enTradeDir)pos.NTradeDir);
            htPosition[key] = pos;
            this.BeginInvoke(new DelegatePosition(OnPosition), new object[] { key, bLast });
        }

        public delegate void DelegateTrade(int orderId);
        public void OnTrade(int orderId)
        {
            Trade.Trade trade = (Trade.Trade)htTrade[orderId];
            string code = trade.SzINSTRUMENT;
            string tradeId = trade.SzTradeID;
            string tradeTime = trade.SzTradeTime;
            int requestId = trade.NRequestID;
            enTradeDir dir = (enTradeDir)trade.NTradeDir;
            enTradeOperate operate =(enTradeOperate) trade.NTradeOperate;
            Console.WriteLine("Trade:{" + orderId  + "," + code + "," + dir + "," + operate + "}");
            for (int i = 0; i < dgvOrder.Rows.Count; i++)
            {
                if (dgvOrder.Rows[i].Tag.ToString().Equals(orderId.ToString()))
                {
                    dgvOrder.Rows[i].Cells[2].Value = trade.DPrice.ToString("f1");
                    dgvOrder.Rows[i].Cells[6].Value = tradeTime;
                    break;
                }
            }
            if (!finished)
                return;
            foreach (CtlOrder ctl in ctlOrderUI)
                ctl.OnTrade(code, trade);

        }
        public void tradecb(Trade.Trade trade)
        {
            htTrade[trade.NOrderID] = trade;
            this.BeginInvoke(new DelegateTrade(OnTrade), new object[] { trade.NOrderID });
            
        }

        public delegate void DelegateOrder(int orderId);
        public void OnOrder(int orderId)
        {
            Trade.Order order = (Trade.Order)htOrder[orderId];
            string code = order.SzINSTRUMENT;
            string orderTime = order.SzInsertDateTime;
            string tradeTime =order.SzTradeDateTime;
            int requestId = order.NRequestID;
            enTradeOrderStatus status =(enTradeOrderStatus) order.NOrderStatus;
            enTradeDir dir = (enTradeDir)order.NTradeDir;
            enTradeOperate operate = (enTradeOperate)order.NTradeOperate;
            Console.WriteLine("Order:{" + orderId + "," + code + "," +dir+","+operate+","+order.DAvgPrice+","+ status + "}");
            int rowId = -1;
            for (int i = 0; i < dgvOrder.Rows.Count; i++)
            {
                if (dgvOrder.Rows[i].Tag.ToString().Equals(orderId.ToString()))
                {
                    rowId = i;
                    break;
                }
            }

            if (rowId < 0 && status != enTradeOrderStatus.TRADE_ORDER_STATUS_CANCELED)
                rowId = dgvOrder.Rows.Add();
            if (rowId < 0)
                return;
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_CANCELED)
            {
                dgvOrder.Rows.RemoveAt(rowId);
                return;
            }
            
            dgvOrder.Rows[rowId].Tag = orderId;
            dgvOrder.Rows[rowId].Cells[0].Value = orderTime;
            dgvOrder.Rows[rowId].Cells[1].Value = code;
            dgvOrder.Rows[rowId].Cells[2].Value = order.DLimitPrice.ToString("f1");

            if(dir==enTradeDir.TRADE_DIR_BUY)
                dgvOrder.Rows[rowId].Cells[3].Value = "买";
            else
                dgvOrder.Rows[rowId].Cells[3].Value = "卖";

            if(operate==enTradeOperate.TRADE_OPERATE_OPEN)
                dgvOrder.Rows[rowId].Cells[4].Value = "open";
            else if (operate == enTradeOperate.TRADE_OPERATE_CLOSE)
                dgvOrder.Rows[rowId].Cells[4].Value = "close";
            else if (operate == enTradeOperate.TRADE_OPERATE_CLOSE_TODAY)
                dgvOrder.Rows[rowId].Cells[4].Value = "close today";

            if(status==enTradeOrderStatus.TRADE_ORDER_STATUS_UNKNOW)
                dgvOrder.Rows[rowId].Cells[5].Value = "unknow";
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT)
            {
                dgvOrder.Rows[rowId].Cells[5].Value = "wait";
                dgvOrder.Rows[rowId].Cells[this.ColCancel.Index].Value = "撤销";
            }
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_NOTWAIT)
                dgvOrder.Rows[rowId].Cells[5].Value = "not wait";
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_TRADED)
            {
                dgvOrder.Rows[rowId].Cells[5].Value = "traded";
                dgvOrder.Rows[rowId].Cells[this.ColCancel.Index].Value = "";
            }
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_CANCELED)
            {
                dgvOrder.Rows[rowId].Cells[5].Value = "cancel";
                dgvOrder.Rows[rowId].Cells[this.ColCancel.Index].Value = "";
            }
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_PARTIAL)
                dgvOrder.Rows[rowId].Cells[5].Value = "partial";
            if (status == enTradeOrderStatus.TRADE_ORDER_STATUS_NOTPARTIAL)
                dgvOrder.Rows[rowId].Cells[5].Value = "not partial";

            dgvOrder.Rows[rowId].Cells[6].Value = tradeTime;
        }
        public void ordercb(Trade.Order order)
        {
            htOrder[order.NOrderID] = order;
            this.BeginInvoke(new DelegateOrder(OnOrder), new object[] { order.NOrderID });
        }

        public delegate void DelegateError(int nRequestID);
        public void OnError(int nRequestID)
        {
            SetStatus("Error:{" + nRequestID + "}");
            Console.WriteLine("Error:{" + nRequestID + "}");
        }
        public void errorcb(int nRequestID)
        {
            this.BeginInvoke(new DelegateError(OnError), new object[] { nRequestID });
        }
        private void Form1_Activated(object sender, EventArgs e)
        {
            DataCenter.GetInatance().SetBus(bus);
        }
        delegate void update();
        private void DataArrived(object sender, DataEventArgs e)
        {
            try
            {
                Invoke(new update(UpdateData));
            }
            catch (Exception ex)
            {
                Logger.Error("RunStrategies err:" + ex.ToString());
            }
        }
        public void UpdateData()
        {
            try
            {
                foreach (string code in codes)
                {
                    HQData data = new HQData();
                    datacenter.GetHQ(code, ref data);
                    if (data!=null)
                    {
                        foreach (CtlOrder ctl in ctlOrderUI)
                            ctl.OnIndex(code, data);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error("UpdateData error," + ex.ToString());
            }
        }
        
        private void dgv_RowEnter(object sender, DataGridViewCellEventArgs e)
        {
            string code = dgv.Rows[e.RowIndex].Cells[0].Value.ToString();
        }

        private int GetPosition(string code)
        {
            int netPos = 0;
            string key = getKey(code, enTradeDir.TRADE_DIR_BUY);
            if (htPosition.ContainsKey(key))
            {
                Trade.Position pos = (Trade.Position)htPosition[key];
                netPos = pos.NPosition;
            }
            key = getKey(code, enTradeDir.TRADE_DIR_SELL);
            if (htPosition.ContainsKey(key))
            {
                Trade.Position pos = (Trade.Position)htPosition[key];
                netPos -= pos.NPosition;
            }
            return netPos;
        }
        private bool modify(int orderId, double price)
        {
            Trade.ModifyReq.Builder order = new Trade.ModifyReq.Builder();
            order.SetOrderid(orderId);
            order.SetPrice(price);
            bool ret = bus.PostMessage(order.Build());
            return ret;
        }
        private bool Modify(string code, enTradeDir dir, double price)
        {
            foreach (int orderid in htOrder.Keys)
            {
                Trade.Order order = (Trade.Order)htOrder[orderid];
                string strCode = order.SzINSTRUMENT;
                if (strCode.Equals(code) && order.NTradeDir == (int)dir && order.NOrderStatus == (int)enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT)
                {
                    modify(order.NOrderID, price);
                    return true;
                }
            }
            return false;
        }

        public void Bid(string code,double price)
        {
            ClearStatus();
            if (!htQuote.ContainsKey(code))
                return;
            Trade.MarketData data = (Trade.MarketData)htQuote[code];
            if (Math.Abs(price - data.DLastPrice) / data.DLastPrice > 0.01f)
            {
                SetStatus("价格偏离正常值！");
                return;
            }
            int netPos = GetPosition(code);
            if (netPos > 0 && ckbEnableMulti.Checked == false)
            {
                SetStatus("仓位超限！");
                return;
            }
            if (Modify(code, enTradeDir.TRADE_DIR_BUY, price))
            {
                return;
            }
            if (ckbClose.Checked)
            {
                Order(code, price, ORDER_TYPE.BUYTOCOVER);
            }
            else if (ckbOpen.Checked)
            {
                Order(code, price, ORDER_TYPE.BUY);
            }
            else
            {
                Order(code, price, ORDER_TYPE.SMARTBUY);
            }
        }

        public void Order(string code,double price,ORDER_TYPE type)
        {
            Trade.OrderReq.Builder order = new Trade.OrderReq.Builder();
            order.SetCode(code);
            order.SetPrice(price);
            order.SetType((int)type);
            bool ret = bus.PostMessage(order.Build());
        }
        public void Ofr(string code, double price)
        {
            ClearStatus();
            if (!htQuote.ContainsKey(code))
                return;
            Trade.MarketData data = (Trade.MarketData)htQuote[code];
            if (Math.Abs(price - data.DLastPrice) / data.DLastPrice > 0.01f)
            {
                SetStatus("价格偏离正常值！");
                return;
            }
            int netPos = GetPosition(code);
            if (netPos < 0)
            {
                SetStatus("仓位超限！");
                return;
            }
            if (!cbOfrAvailable.Checked && netPos<1)
            {
                SetStatus("禁止先开空单！");
                return;
            }
            if (Modify(code, enTradeDir.TRADE_DIR_SELL, price))
            {
                return;
            }
            if (ckbClose.Checked)
            {
                Order(code, price, ORDER_TYPE.SELL);
            }
            else if (ckbOpen.Checked)
            {
                Order(code, price, ORDER_TYPE.SELLSHORT);
            }
            else
            {
                Order(code, price, ORDER_TYPE.SMARTSELL);
            }
        }
        private bool cancel(int orderId)
        {
            Trade.CancelReq.Builder order = new Trade.CancelReq.Builder();
            order.SetOrderid(orderId);
            bool ret = bus.PostMessage(order.Build());
            return ret;
        }
        public void Cancel(string code, double price)
        {
            foreach (DataGridViewRow row in dgvOrder.Rows)
            {
                if (row.Cells[this.ColCancel.Index].Value == null || row.Cells[this.ColCancel.Index].Value.ToString() != "撤销")
                    continue;
                string strCode = row.Cells[1].Value.ToString();
                if (!strCode.Equals(code))
                    continue;
                int orderId = (int)row.Tag;
                if (!htOrder.ContainsKey(orderId))
                    continue;
                cancel(orderId);
            }
        }

        private void ClearStatus()
        {
            toolStripStatusLabel2.Text = "";
        }
        private void SetStatus(String status)
        {
            toolStripStatusLabel2.Text = status;
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
        }

        private void dgvOrder_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0)
                return;
            if (e.ColumnIndex != this.ColCancel.Index)
                return;
            int orderId = (int)dgvOrder.Rows[e.RowIndex].Tag;
            if (!htOrder.ContainsKey(orderId))
                return;
            cancel(orderId);
        }

        private void cbLock_CheckedChanged(object sender, EventArgs e)
        {
            foreach(CtlOrder ctl in ctlOrderUI)
                ctl.Enabled=!cbLock.Checked;
        }

        private void cbOfrAvailable_CheckedChanged(object sender, EventArgs e)
        {

        }

        private Form mdiParent = null;
        private void pbPop_Click(object sender, EventArgs e)
        {
            if (this.MdiParent != null)
            {
                mdiParent = this.MdiParent;
                this.MdiParent = null;
                this.KeyPreview = true;
            }
            else
            {
                this.MdiParent = mdiParent;
                this.KeyPreview = false;

            }
            
        }
        private void FrmOptionTrade_ParentChanged(object sender, EventArgs e)
        {
            if (this.MdiParent != null)
            {
                //this.WindowState = FormWindowState.Maximized;
            }
            else
            {
                this.WindowState = FormWindowState.Normal;
                this.Width = groupBox.Width + 30;
                this.Height = groupBox.Height + 30;
            }
        }
        private void ckbOpen_CheckedChanged(object sender, EventArgs e)
        {
            if (ckbOpen.Checked)
                ckbClose.Checked = false;
        }

        private void ckbClose_CheckedChanged(object sender, EventArgs e)
        {
            if (ckbClose.Checked)
                ckbOpen.Checked = false;
        }
        private void btnLogin_Click(object sender, EventArgs e)
        {
            dgv.Rows.Clear();
            dgvOrder.Rows.Clear();
            htPosition.Clear();
            Trade.LoginReq.Builder login = new Trade.LoginReq.Builder();
            login.SetUserid("");
            login.SetPasswd("");
            string[] arrCodes = File.ReadAllLines(@"Codelist.txt");
            for (int i = 0; i < arrCodes.Length; i++)
                login.AddInstruments(arrCodes[i]);
            object obj = bus.SendMessage(login.Build(), 3000, new MsgExpress.packet.Options());
            if (obj is Trade.LoginResp)
            {
                MessageBox.Show((obj as Trade.LoginResp).Msg);
            }
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            Trade.LogoutReq.Builder logout = new Trade.LogoutReq.Builder();
            
            object obj = bus.SendMessage(logout.Build(), 5000, new MsgExpress.packet.Options());
            if (obj is Trade.LogoutResp)
            {
                //MessageBox.Show((obj as Trade.LogoutResp).Msg);
            }
            dgv.Rows.Clear();
            dgvOrder.Rows.Clear();
            htPosition.Clear();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Trade.MarketDataReq.Builder builder = new Trade.MarketDataReq.Builder();
            builder.SetCode("IC1802");
            builder.SetDate("");
            object obj = bus.SendMessage(builder.Build(), 60000, new MsgExpress.packet.Options());
            if (obj is Trade.MarketDataResp)
            {
               Trade.MarketDataResp data=obj as Trade.MarketDataResp;
            }
        }
    }
}

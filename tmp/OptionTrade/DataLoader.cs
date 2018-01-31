using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StockServer;
using Noesis.Javascript;
using MsgExpress;
using MsgExpress.databus;

namespace CommonCtrl
{
    public class TickData
    {
        public int Time { set; get; }
        public double Vol { set; get; }
        public double TotalVol { set; get; }
        public float AvePrice { set; get; }
        public float Price { set; get; }
        public int Direction { set; get; }
    }
    public class HQData
    {
        public float Lastclose;
        public float Open;
        public float Close;
        public float High;
        public float Low;
        public double Vol;
        public double Amount;
        public float turnoverratio;
        public string Date;
        public int Time;

        public  float[] BuyPrice;
        public  int[] BuyVolume;
        public  float[] SellPrice;
        public  int[] SellVolume;

        private void Init()
        {
            BuyPrice = new float[5];
            BuyVolume = new int[5];
            SellPrice = new float[5];
            SellVolume = new int[5];
        }

        public HQData()
        {
            Init();
        }

        public HQData(HQData hq)
        {
            Init();
            this.Lastclose = hq.Lastclose;
            this.Open = hq.Open;
            this.Close = hq.Close;
            this.High = hq.High;
            this.Low = hq.Low;
            this.Vol = hq.Vol;
            this.Amount = hq.Amount;
            this.Date = hq.Date;
            this.Time = hq.Time;
            for (int i = 0; i < 5; i++)
            {
                BuyPrice[i] = hq.BuyPrice[i];
                BuyVolume[i] = hq.BuyVolume[i];
                SellPrice[i] = hq.SellPrice[i];
                SellVolume[i] = hq.SellVolume[i];
            }
        }

        public void SetData(StockServer.StockData.Builder builder)
        {
            builder.SetLastclose(Lastclose);
            builder.SetOpen(Open);
            builder.SetClose(Close);
            builder.SetHigh(High);
            builder.SetLow(Low);
            builder.SetVolume((float)Vol);
            builder.SetAmount((float)Amount);
            builder.SetDatetime(Date);
        }
    }
    public class DataLoader
    {
        private static System.Net.WebClient wc1 = new System.Net.WebClient();
        private static System.Net.WebClient wc2 = new System.Net.WebClient();
        private static JavascriptContext ctx = new JavascriptContext();
        private static int count = 0;
        public static bool GetTickHistory(string code,ref List<TickData> tickHis)
        {
            byte[] bResponse = null;
            try
            {
                bResponse = wc1.DownloadData("http://vip.stock.finance.sina.com.cn/quotes_service/view/CN_TransListV2.php?num=4800&symbol="+code+"&rn=14738312099"+count.ToString());
            }
            catch (Exception ex)
            {
                Logger.Error("下载数据出错："+ex.ToString());
                return false;
            }
            if (bResponse == null)
                return false;
            string strResponse = Encoding.Default.GetString(bResponse);
            try
            {
                ctx.Run(strResponse);
            }
            catch (Exception)
            {
                return false;
            }
            object trade_item_list = ctx.GetParameter("trade_item_list");
            object trade_INVOL_OUTVOL = ctx.GetParameter("trade_INVOL_OUTVOL");
            tickHis.Clear();
            Array arr = trade_item_list as Array;
            for (int i = arr.Length - 1; i>=0; i--)
            {
                TickData tick = new TickData();
                Array itemArr = arr.GetValue(i) as Array;
                String strTime = itemArr.GetValue(0) as string;
                int hour = Convert.ToInt32(strTime.Substring(0, 2));
                int minite = Convert.ToInt32(strTime.Substring(3, 2));
                int second = Convert.ToInt32(strTime.Substring(6, 2));
                int time = hour * 3600 + minite * 60 + second - 34200;
                if (time<0 && time >=-300)
                    time = 0;
                if (time > 7200 && time <= 12600)
                    time = 7200;
                else if (time > 12600)
                    time -= 5400;
                if (time > 14400)
                    time = 14400;
                if (time >= 0)
                {
                    tick.Time = time;
                    tick.Vol = Convert.ToInt32(itemArr.GetValue(1));
                    tick.Price = Convert.ToSingle(itemArr.GetValue(2));
                    tick.Direction = (itemArr.GetValue(3) as string) == "DOWN" ? 0 : 1;
                    if(tick.Vol>0)
                        tickHis.Add(tick);
                }
            }

            return true;
        }
        public static void GetCurrentPrice(string[] codes, ref Dictionary<string, HQData> result)
        {
            return;
            if (codes.Length < 1)
                return;
            string codelist="";
            for (int i = 0; i < codes.Length; i++)
            {
                if (codes[i].StartsWith("IF") || codes[i].StartsWith("IC"))
                    codelist += "CFF_RE_" + codes[i] + ",";
                else
                    codelist += codes[i] + ",";
            }
            byte[] bResponse = null;
            try
            {
                bResponse = wc2.DownloadData("http://hq.sinajs.cn/format=js&list=" + codelist);
            }
            catch (Exception ex)
            {
                Logger.Error("下载实时行情出错："+ex.ToString());
                return;
            }
            if (bResponse == null)
                return;
            string strResponse = Encoding.Default.GetString(bResponse);
            ctx.Run(strResponse);
            
            string[] arr = strResponse.Split(";".ToCharArray());
            for (int i = 0; i < codes.Length; i++)
            {
                object data = ctx.GetParameter("hq_str_" + codes[i]);
                if (codes[i].StartsWith("IF") || codes[i].StartsWith("IC"))
                    data=ctx.GetParameter("hq_str_CFF_RE_" + codes[i]);
                if (data == null)
                    continue;
                string[] dataArr = (data as string).Split(",".ToCharArray());
                if (dataArr.Length < 5)
                    continue;
                string code = codes[i];
                HQData hq = null;
                lock (result)
                {
                    if (result.ContainsKey(code))
                        hq = result[code];
                    if (hq == null)
                    {
                        hq = new HQData();
                        result[code] = hq;
                    }
                }
                if (code.StartsWith("of"))
                {
                    hq.Lastclose = Convert.ToSingle(dataArr[3]);
                    hq.Open = Convert.ToSingle(dataArr[1]);
                    hq.Close = Convert.ToSingle(dataArr[1]);
                    hq.High = Convert.ToSingle(dataArr[1]);
                    hq.Low = Convert.ToSingle(dataArr[1]);
                    hq.Vol = 0;
                    hq.Amount = 0;
                    hq.Date = dataArr[dataArr.Length - 1];
                }
                else if (code.StartsWith("IF") || code.StartsWith("IC"))
                {
                    hq.Lastclose = Convert.ToSingle(dataArr[13]);
                    hq.Open = Convert.ToSingle(dataArr[0]);
                    hq.Close = Convert.ToSingle(dataArr[3]);
                    hq.High = Convert.ToSingle(dataArr[1]);
                    hq.Low = Convert.ToSingle(dataArr[2]);
                    hq.Vol = 0;
                    hq.Amount = 0;
                    hq.Date = dataArr[dataArr.Length - 1];
                }
                else
                {
                    hq.Lastclose = Convert.ToSingle(dataArr[2]);
                    hq.Open = Convert.ToSingle(dataArr[1]);
                    hq.Close = Convert.ToSingle(dataArr[3]);
                    hq.High = Convert.ToSingle(dataArr[4]);
                    hq.Low = Convert.ToSingle(dataArr[5]);
                    hq.Vol = Convert.ToDouble(dataArr[8]);
                    hq.Amount = Convert.ToDouble(dataArr[9]);
                    hq.Date = dataArr[dataArr.Length - 3];
                    String strTime = dataArr[dataArr.Length - 2];
                    int hour = Convert.ToInt32(strTime.Substring(0, 2));
                    int minite = Convert.ToInt32(strTime.Substring(3, 2));
                    int second = Convert.ToInt32(strTime.Substring(6, 2));
                    int time = hour * 3600 + minite * 60 + second - 34200;
                    if (time < 0)
                        time = 0;
                    if (time > 7200 && time <= 12600)
                        time = 7200;
                    else if (time > 12600)
                        time -= 5400;
                    if (time > 14400)
                        time = 14400;
                    hq.Time = time;
                    for (int n = 0; n < 5; n++)
                    {
                        hq.BuyVolume[n] = Convert.ToInt32(dataArr[10 + 2 * n]);
                        hq.BuyPrice[n] = Convert.ToSingle(dataArr[11 + 2 * n]);
                        hq.SellVolume[n] = Convert.ToInt32(dataArr[20 + 2 * n]);
                        hq.SellPrice[n] = Convert.ToSingle(dataArr[21 + 2 * n]);
                    }
                }
                
            }
            
            return ;
        }
    }
}

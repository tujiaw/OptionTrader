using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Runtime.InteropServices;
using MsgExpress;
using MsgExpress.databus;
using StockServer;

namespace CommonCtrl
{
    public class DataEventArgs : EventArgs
    {
        public List<string> Codes { set; get; }
        public DataEventArgs()
        {
        }
    }
    public delegate void DataEventHandler(object sender, DataEventArgs e);
    public delegate void PublishHandler(object sender, object msg);

    public class TopicInfo
    {
        public static int APPID = 255;
        public static int TOPIC_TICKDATA = ((APPID << 20) | 0x00001);

        public static int KEY_CODE = 1;
        public static int KEY_NAME = 2;
        public static int KEY_CLOSE = 3;
        public static int KEY_OPEN = 4;
        public static int KEY_HIGH = 5;
        public static int KEY_LOW = 6;
        public static int KEY_VOLUME = 7;
        public static int KEY_AMOUNT = 8;
        public static int KEY_PB = 9;
        public static int KEY_PER = 10;
        public static int KEY_TURNOVERRATIO = 11;
        public static int KEY_DATE = 12;
        public static int KEY_TICKTIME = 13;
    }
    public class DataCenter
    {
        public event DataEventHandler DataUpdated;
        public event PublishHandler PublishUpdated;

        private DataBusManager bus;
        private Dictionary<string, StockServer.StockInfo> dicStock = new Dictionary<string, StockServer.StockInfo>();
        private Dictionary<string, List<TickData>> dicTickList = new Dictionary<string, List<TickData>>();
        private Dictionary<string, HQData> dicHQ = new Dictionary<string, HQData>();
        private Dictionary<string, bool> dicCodes = new Dictionary<string, bool>();
        private bool stop = false;
        private int STEP = 15;

        Semaphore semaphore = new Semaphore(0, 1000);
        private static readonly DataCenter instance = new DataCenter();

        private DataCenter()
        {
            Thread th = new Thread(ThreadMethod);            
            th.Start();

            Thread th2 = new Thread(ThreadGetHis);
            th2.Start();
        }

        public static DataCenter GetInatance()
        {
            return instance;
        }

        public StockServer.StockInfo GetStockInfo(string code)
        {
            if (!dicStock.ContainsKey(code))
                return null;
            return dicStock[code];
        }

        public void SetBus(DataBusManager databus)
        {
            bus = databus;
            bus.PublishPackage += new PublishEventHandle(OnPublishPackage);
            //StockServer.StockInfoRequest.Builder builder = StockServer.StockInfoRequest.CreateBuilder();
            //builder.SetType(0);
            //object obj = bus.SendMessage(builder.Build(), 3000, new MsgExpress.packet.Options());
            //if (obj is StockServer.StockInfoResponse)
            //{
            //    StockServer.StockInfoResponse resp = obj as StockServer.StockInfoResponse;
            //    dicHQ.Clear();
            //    dicStock.Clear();
            //    foreach (StockServer.StockInfo info in resp.DataList)
            //    {
            //        dicStock.Add(info.Code, info);
            //    }
            //}
        }

        private void OnPublishPackage(object sender, PublishEventArgs e)
        {
            int topic = 0;
            if (e.PublishData.mMsg != null && e.PublishData.mMsg is MsgExpress.PublishData)
                topic = (e.PublishData.mMsg as MsgExpress.PublishData).Topic;
            else if (e.PublishData.mMsg != null)
            {
                if (PublishUpdated != null)
                    PublishUpdated(this, e.PublishData.mMsg);
                return;
            }
            if (topic!=TopicInfo.TOPIC_TICKDATA)
                return;
            MsgExpress.PublishData pub = e.PublishData.mMsg as MsgExpress.PublishData;
            if (pub == null)
                return;
            Logger.Info("publish data");
            List<string> codelist = new List<string>();
            string content = pub.GetItem(0).GetStrVal(0);
            string[] arr = content.Split("\r".ToCharArray());
            lock (dicHQ)
            {
                for (int i = 0; i < arr.Length; i++)
                {
                    if (arr[i].Trim().Length < 10)
                        continue;
                    string[] item = arr[i].Split(",".ToCharArray());
                    if (item.Length < 5)
                        continue;
                    string code = item[0];
                    codelist.Add(code);
                    HQData hq = null;
                    if (dicHQ.ContainsKey(code))
                        hq = dicHQ[code];
                    if (hq == null)
                    {
                        hq = new HQData();
                        dicHQ[code] = hq;
                    }
                    hq.Close = Convert.ToSingle(item[1]);
                    hq.Lastclose = Convert.ToSingle(item[2]);
                    hq.Vol = Convert.ToSingle(item[3]);
                    hq.Amount = Convert.ToSingle(item[4]);
                    hq.turnoverratio = Convert.ToSingle(item[5]);
                    
                    String strTime = item[6];
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
                }
            }
            if (codelist.Count > 0 && DataUpdated != null)
                DataUpdated(this, new DataEventArgs() { Codes = codelist });
            //Logger.Info("process publish data over");
        }

        public void Stop()
        {
            stop = true;
            semaphore.Release();
        }

        public void GetTickList(string code, ref List<TickData> tickList)
        {
            lock (dicTickList)
            {
                if (dicTickList.ContainsKey(code))
                    tickList = dicTickList[code];
                else
                    tickList = null;
            }
        }

        public void GetHQ(string code, ref HQData data)
        {
            lock (dicHQ)
            {
                if (dicCodes.ContainsKey(code) && dicHQ.ContainsKey(code))
                    data = new HQData(dicHQ[code]);
                else
                {
                    AddCode(code,false);
                    data = null;
                }
            }
        }

        public void Clear()
        {
            lock (dicCodes)
            {
                string[] arrCode = dicCodes.Keys.ToArray();
                foreach (string code in arrCode)
                {
                    if (!dicCodes[code])
                        dicCodes.Remove(code);
                }
            }
        }

        public void ClearData(string code)
        {
            lock (dicTickList)
            {
                dicTickList.Remove(code);
                semaphore.Release();
            }
        }

        public void RemoveCode(string code)
        {
            lock (dicCodes)
            {
                if (!dicCodes.ContainsKey(code))
                    return;
                if(!dicCodes[code])
                    dicCodes.Remove(code);
            }
        }

        public void AddCode(string[] codes,bool forever)
        {
            lock (dicCodes)
            {
                for (int i = 0; i < codes.Length; i++)
                {
                    if (dicCodes.ContainsKey(codes[i]))
                        continue;
                    dicCodes.Add(codes[i], forever);
                }
            }
            semaphore.Release(codes.Length);
        }

        public void AddCode(string code, bool forever)
        {
            lock (dicCodes)
            {
                if (dicCodes.ContainsKey(code))
                    return;
                dicCodes.Add(code, forever);
            }
            semaphore.Release();
        }

        private void ThreadMethod()
        {
            return;
            while (!stop)
            {
                string[] codes = null;
                lock (dicCodes)
                {
                    codes = dicCodes.Keys.ToArray();
                }
                if (codes.Length == 0)
                {
                    Thread.Sleep(100);
                    continue;
                }
                lock (dicHQ)
                {
                    DataLoader.GetCurrentPrice(codes, ref dicHQ);
                }
                List<string> codelist = new List<string>();
                List<string> tmplist=dicHQ.Keys.ToList();
                foreach (string code in tmplist)
                {
                    List<TickData> list = null;
                    lock (dicTickList)
                    {
                        if (dicTickList.ContainsKey(code))
                            list = dicTickList[code];
                    }
                    if (list != null && list.Count>0)
                    {
                        HQData hq=dicHQ[code];
                        if (hq.Time <= list[list.Count - 1].Time)
                            continue;
                        //else if (hq.Time - list[list.Count - 1].Time > 300)// 5 minites
                        //{
                        //    lock (dicTickList)
                        //    {
                        //        dicTickList.Remove(code);
                        //        semaphore.Release();
                        //    }
                        //    continue;
                        //}
                        codelist.Add(code);
                        if (hq.Time < STEP * (list.Count + 1))
                        {
                            TickData data = list[list.Count - 1];
                            double vol = (double)(hq.Vol - data.TotalVol + data.Vol);
                            double amount = data.Price * data.Vol + hq.Close * (hq.Vol - data.TotalVol);
                            data.Vol = vol;
                            if(vol>0)
                                data.Price =(float)( amount / vol);
                            data.Time = hq.Time;
                            data.TotalVol = hq.Vol;
                            if (list.Count > 1)
                            {
                                double totalAmount = data.Price * data.Vol + list[list.Count - 2].AvePrice * list[list.Count - 2].TotalVol;
                                data.AvePrice =(float)( totalAmount / data.TotalVol);
                            }
                            else
                                data.AvePrice = data.Price;
                            if (data.AvePrice < 0.1f || data.Price < 0.1f)
                                Logger.Error("err price");
                        }
                        else
                        {
                            TickData data = new TickData();
                            data.Vol = (hq.Vol - list[list.Count - 1].TotalVol);
                            data.Price = hq.Close;
                            data.AvePrice = list[list.Count - 1].AvePrice;
                            data.TotalVol = hq.Vol;
                            data.Time=hq.Time;
                            list.Add(data);
                        }
                    }
                    else
                        codelist.Add(code);
                }
                if (codelist.Count>0 && DataUpdated != null)
                    DataUpdated(this, new DataEventArgs() { Codes = codelist });
                    
            }
        }
        private void ThreadGetHis()
        {
            while (!stop)
            {
                semaphore.WaitOne();
                if (stop)
                    break;
                string[] codes = null;
                lock (dicCodes)
                {
                    codes = dicCodes.Keys.ToArray();
                }
                for (int i = 0; i < codes.Length; i++)
                {
                    if (stop)
                        break;
                    lock (dicTickList)
                    {
                        if (dicTickList.ContainsKey(codes[i]))
                            continue;
                    }
                    //StockServer.TickDataRequest.Builder builder = new StockServer.TickDataRequest.Builder();
                    //builder.SetCode(codes[i]);
                    //DateTime dt = DateTime.Now.AddDays(-1);
                    //string strDt = dt.ToString("yyyy-MM-dd");
                    //builder.SetDatetime(strDt);
                    //StockServer.TickDataRequest req = builder.Build();
                    //object obj=bus.SendMessage(req, 3000, new MsgExpress.packet.Options());
                    //if (obj is StockServer.TickDataResponse)
                    //{
                    //    StockServer.TickDataResponse resp = obj as StockServer.TickDataResponse;
                    //}

                    List<TickData> list = new List<TickData>();
                    if (DataLoader.GetTickHistory(codes[i], ref list))
                    {
                        if (list.Count < 1)
                            continue;
                        Logger.Info("下载历史数据成功,code=" + codes[i]);
                        List<TickData> result = new List<TickData>();
                        double sumVol = 0;
                        double totalVol = 0;
                        double totalAmount = 0.0f;
                        double sumAmount = 0.0f;
                        for (int j = 0; j < list.Count + 1; j++)
                        {
                            TickData tick = null;
                            if (j < list.Count)
                            {
                                tick = list[j];
                                if (tick.Time == 0 || tick.Vol == 0)
                                    continue;
                            }
                            if (j == list.Count || tick.Time >= STEP * (result.Count + 1))
                            {
                                TickData data = new TickData();
                                data.Vol = sumVol;
                                if (sumVol > 0)
                                    data.Price = (float)(sumAmount / sumVol);
                                else if (result.Count > 0)
                                    data.Price = result[result.Count - 1].Price;
                                if (totalVol > 0)
                                    data.AvePrice =(float)( totalAmount / totalVol);
                                else
                                    data.AvePrice = data.Price;
                                if (j > 0)
                                    data.Time = list[j - 1].Time;
                                else
                                    data.Time = 0;
                                data.TotalVol = totalVol;
                                if (data.AvePrice < 0.1f || data.Price<0.1f)
                                    Logger.Error("err price");
                                if (data.AvePrice > 0.1f)
                                    result.Add(data);
                                sumVol = 0;
                                sumAmount = 0.0f;
                            }
                            if (j == list.Count)
                                break;
                            sumVol += tick.Vol;
                            totalVol += tick.Vol;
                            sumAmount += tick.Vol * tick.Price;
                            totalAmount += tick.Vol * tick.Price;
                        }
                        lock (dicTickList)
                        {
                            dicTickList.Add(codes[i], result);
                        }
                    }
                    else
                    {
                        Logger.Info("下载历史数据失败,code=" + codes[i]);
                        Thread.Sleep(1000);
                    }
                }
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using MsgExpress.databus;
using MsgExpress.packet;
using CommonCtrl;

namespace OptionTrade
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            

            MsgExpress.Logger.Init(Application.StartupPath + "\\..\\config\\log4net.config");
            DataBusManager bus = new DataBusManager();
            bool ret = bus.Initialize(Application.StartupPath + "\\..\\config\\");
            FrmOptionTrade login = new FrmOptionTrade();
            login.bus = bus;
            Application.Run(login);
            bus.Release();
        }
    }
}

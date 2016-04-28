using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TBA.BeastWebServer.Utilities;
using TBA.Utilities.LogUtility;

namespace TBA.BeastWebServer
{
    public partial class ReadConfig : System.Web.UI.Page
    {
        private ConfigReader configReader = null;

        protected void Page_Load(object sender, EventArgs e)
        {
            configReader = new ConfigReader(new LogService());
        }

        protected void btnGetConfig_Click(object sender, EventArgs e)
        {
            try { userName.Text = configReader.ServerUserName; }
            catch { }

            try { password.Text = configReader.ServerPassword; }
            catch { }

            try { serverName.Text = configReader.ServerName1; }
            catch { }

            try { serverName2.Text = configReader.ServerName2; }
            catch { }

            try { port.Text = configReader.ServerPort; }
            catch { }

            try { retryCount.Text = configReader.ServerRetryCount; }
            catch { }

            try { redisserver.Text = configReader.RedisServer; }
            catch { }

            try { redisexpiretime.Text = configReader.RedisDataExpireInMinute; }
            catch { }
        }
    }
}
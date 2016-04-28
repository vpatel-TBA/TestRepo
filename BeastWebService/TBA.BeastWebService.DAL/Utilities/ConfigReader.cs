using System;
using System.Configuration;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.DAL.Utilities
{
    public class ConfigReader : IConfigReader
    {
        private readonly ILogService logService = null;

        public ConfigReader(ILogService logService)
        {
            this.logService = logService;
            try
            {
                sharedAppUrl = ConfigurationManager.AppSettings["SharedAppUrl"];
                fromMailAddress = ConfigurationManager.AppSettings["FromMailAddress"];
                redisServer = ConfigurationManager.AppSettings["RedisServer"];
                redisDataExpireInMinute = ConfigurationManager.AppSettings["RedisDataExpireInMinute"];
                sharedUrlExpirationTime = Convert.ToInt32(ConfigurationManager.AppSettings["SharedUrlExpirationTime"]);
                sessionServerConnectionString = ConfigurationManager.ConnectionStrings["SessionServerConnectionString"].ToString();
                appStoreConnectionString = ConfigurationManager.ConnectionStrings["AppStoreConnectionString"].ToString();
                accountSid = ConfigurationManager.AppSettings["AccountSid"];
                authToken = ConfigurationManager.AppSettings["AuthToken"];
                senderPhoneNo = ConfigurationManager.AppSettings["SenderPhoneNo"];

                try
                {
                    enableEmail = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableEmail"]);
                }
                catch (Exception exception)
                {
                    enableEmail = false;
                    logService.Error("ConfigReader", "ConfigReader", ExceptionCode.EnableEmailFail, DateTime.Now, 0, "", "", 0, "", "", "", "Set EnableEmail true or false", exception);
                }
                
                logService.Info("ConfigReader", "ConfigReader", OperationCode.InitConfigReader, DateTime.Now, 0, "", "", 0, "", "", " RedisServer: " + redisServer + " FromMailAddress:" + fromMailAddress + " SharedAppUrl:" + sharedAppUrl + " EnableMail:" + enableEmail + " SessionServerConnectionString:" + sessionServerConnectionString + " AppStoreConnectionString:" + appStoreConnectionString);
            }
            catch (Exception exception)
            {
                logService.Error("ConfigReader", "ConfigReader", ExceptionCode.InitConfigReaderFail, DateTime.Now, 0, "", "", 0, "", "", "", "SessionServerConnectionString" + sessionServerConnectionString + "AppStoreConnectionString" + appStoreConnectionString, exception);
            }
        }

        private string sessionServerConnectionString = string.Empty;
        public string SessionServerConnectionString
        {
            get
            {
                return sessionServerConnectionString;
            }
        }

        private string appStoreConnectionString = string.Empty;
        public string AppStoreConnectionString
        {
            get
            {
                return appStoreConnectionString;
            }
        }

        private string redisServer = string.Empty;
        public string RedisServer
        {
            get
            {
                return redisServer;
            }
        }

        private string redisDataExpireInMinute = string.Empty;
        public string RedisDataExpireInMinute
        {
            get
            {
                return redisDataExpireInMinute;
            }
        }

        private string fromMailAddress = string.Empty;
        public string FromMailAddress
        {
            get
            {
                return fromMailAddress;
            }
        }

        private bool enableEmail = false;
        public bool EnableEmail
        {
            get
            {
                return enableEmail;
            }
        }

        private string sharedAppUrl = string.Empty;
        public string SharedAppUrl
        {
            get
            {
                return sharedAppUrl;
            }
        }

        private int sharedUrlExpirationTime = 60;
        public int SharedUrlExpirationTime
        {
            get
            {
                return sharedUrlExpirationTime;
            }
        }

        private string accountSid = string.Empty;
        public string AccountSid
        {
            get
            {
                return accountSid;
            }
        }

        private string authToken = string.Empty;
        public string AuthToken
        {
            get
            {
                return authToken;
            }
        }

        private string senderPhoneNo = string.Empty;
        public string SenderPhoneNo
        {
            get
            {
                return senderPhoneNo;
            }
        }
    }
}

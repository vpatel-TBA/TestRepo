using System;
using System.Configuration;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.Utilities
{
    public class ConfigReader : IConfigReader
    {
        private readonly ILogService logService = null;

        public ConfigReader(ILogService logService)
        {
            this.logService = logService;

            try
            {
                serverName1 = ConfigurationManager.AppSettings["ServerName1"];
                serverName2 = ConfigurationManager.AppSettings["ServerName2"];
                serverUserName = ConfigurationManager.AppSettings["ServerUserName"];
                serverPassword = ConfigurationManager.AppSettings["ServerPassword"];
                serverPort = ConfigurationManager.AppSettings["ServerPort"];
                serverRetryCount = ConfigurationManager.AppSettings["ServerRetryCount"];

                redisServer = ConfigurationManager.AppSettings["RedisServer"];
                redisServerExpireTime = ConfigurationManager.AppSettings["RedisDataExpireInMinute"];
                logService.Info("ConfigReader", "ConfigReader", OperationCode.InitConfigReader, DateTime.Now, 0, "", "", 0, "", "", "ServerName1: " + serverName1 + " ServerName2:" + serverName2 + " RedisServer:" + redisServer + " ServerPort:" + serverPort + " ServerRetryCount:" + serverRetryCount);
            }
            catch (Exception exception)
            {
                logService.Error("ConfigReader", "ConfigReader", ExceptionCode.InitConfigReaderFail, DateTime.Now, 0, "", "", 0, "", "", "", "", exception);
            }
        }

        private string serverUserName = string.Empty;
        public string ServerUserName
        {
            get
            {
                return serverUserName;
            }
        }

        private string serverPassword = string.Empty;
        public string ServerPassword
        {
            get
            {
                return serverPassword;
            }
        }

        private string serverName1 = string.Empty;
        public string ServerName1
        {
            get
            {
                return serverName1;
            }
        }

        private string serverName2 = string.Empty;
        public string ServerName2
        {
            get
            {
                return serverName2;
            }
        }

        private string serverPort = string.Empty;
        public string ServerPort
        {
            get
            {
                return serverPort;
            }
        }

        private string serverRetryCount = string.Empty;
        public string ServerRetryCount
        {
            get
            {
                return serverRetryCount;
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

        private string redisServerExpireTime = string.Empty;
        public string RedisDataExpireInMinute
        {
            get
            {
                return redisServerExpireTime;
            }
        }
    }
}

using BeastClientPlugIn;
using System;
using System.Threading;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.ConnectionServices
{
    public class BeastConnectionManager : IBeastConnectionManager
    {
        #region Private Variables

        private readonly ServerAgent serverAgent = null;
        private readonly AutoResetEvent autoResetEvent = null;
        private readonly ILogService logService = null;
        private readonly IConfigReader configReader = null;

        public bool isServerConnected { get; set; }
        public bool isServerForceUnload { get; set; }

        #endregion

        #region Constructor

        public BeastConnectionManager(ServerAgent serverAgent, ILogService logService, IConfigReader configReader)
        {
            isServerConnected = false;
            isServerForceUnload = false;
            this.serverAgent = serverAgent;
            this.logService = logService;
            this.configReader = configReader;
            autoResetEvent = new AutoResetEvent(false);
            ConnectToBeast();
            logService.Debug("BeastConnectionManager", "BeastConnectionManager", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "");
        }

        #endregion

        #region Connect to Session Server

        [LoaderOptimization(LoaderOptimization.MultiDomain)]
        void ConnectToBeast()
        {
            logService.Debug("BeastConnectionManager", "ConnectToBeast", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "ConfigReader.ServerName1:" + configReader.ServerName1 + "ConfigReader.ServerName2:" + configReader.ServerName2);

            try
            {
                serverAgent.StatusChanged += new _IServerAgentEvents_StatusChangedEventHandler(ServerAgentStatusChanged);
                serverAgent.AuthenticationFailed += new _IServerAgentEvents_AuthenticationFailedEventHandler(ServerAgentAuthenticationFailed);
                serverAgent.ConnectionLost += new _IServerAgentEvents_ConnectionLostEventHandler(ServerAgentConnectionLost);
                serverAgent.ConnectionRestored += new _IServerAgentEvents_ConnectionRestoredEventHandler(ServerAgentConnectionRestored);
                serverAgent.ForcedUnLoad += new _IServerAgentEvents_ForcedUnLoadEventHandler(ServerAgentForcedUnLoad);

                Scripting.Dictionary properties = new Scripting.Dictionary();
                Object key = "Server0";
                Object value = configReader.ServerName1;
                properties.Add(ref key, ref value);
                key = "Port0";
                value = configReader.ServerPort;
                properties.Add(ref key, ref value);
                key = "retry0";
                value = configReader.ServerRetryCount;
                properties.Add(ref key, ref value);

                key = "Server1";
                value = configReader.ServerName2;
                properties.Add(ref key, ref value);
                key = "Port1";
                value = configReader.ServerPort;
                properties.Add(ref key, ref value);
                key = "retry1";
                value = configReader.ServerRetryCount;
                properties.Add(ref key, ref value);

                serverAgent.Connect(configReader.ServerUserName, configReader.ServerPassword, properties);

                /*Wait till Connection successfully established.*/
                autoResetEvent.WaitOne();
            }
            catch (Exception exception)
            {
                logService.Error("BeastConnectionManager", "RunBeastPlugin", ExceptionCode.BeastConnectionFail, DateTime.Now, 0, "", "", 0, "", "", "", "ConfigReader.ServerName1: " + configReader.ServerName1 + "ConfigReader.ServerName2: " + configReader.ServerName2, exception);
                throw;
            }
        }

        #endregion

        #region Session Server Events

        private void ServerAgentStatusChanged(ServerConnectionStatus status, string info)
        {
            logService.Debug("BeastConnectionManager", "ServerAgentStatusChanged", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "status:" + status.ToString() + "Info" + info);

            /*Release main thread to start its working
            /*Release the thread that is waiting for connection to be established.*/

            if (status == BeastClientPlugIn.ServerConnectionStatus.CONNECTIONSTATUS_ACTIVE)
            {
                isServerConnected = true;
                autoResetEvent.Set();
                logService.Info("BeastConnectionManager", "ServerAgentStatusChanged", OperationCode.BeastConnectionCreated, DateTime.Now, 0, "", "", 0, "", "", "");
            }
            else if (status == BeastClientPlugIn.ServerConnectionStatus.CONNECTIONSTATUS_INACTIVE)
            {
                isServerConnected = false;
                logService.Info("BeastConnectionManager", "ServerAgentStatusChanged", OperationCode.BeastConnectionInactive, DateTime.Now, 0, "", "", 0, "", "", "");
            }
        }

        private void ServerAgentAuthenticationFailed(string info)
        {
            logService.Error("BeastConnectionManager", "ServerAgentAuthenticationFailed", ExceptionCode.BeastConnectionAuthenticationFailed, DateTime.Now, 0, "", "", 0, "", "", "", info, null);
        }

        private void ServerAgentConnectionLost()
        {
            isServerConnected = false;
            logService.Error("BeastConnectionManager", "ServerAgentConnectionLost", ExceptionCode.BeastConnectionLost, DateTime.Now, 0, "", "", 0, "", "", "", "", null);
        }

        private void ServerAgentConnectionRestored()
        {
            isServerConnected = true;
            logService.Info("BeastConnectionManager", "ServerAgentConnectionRestored", OperationCode.BeastConnectionRestored, DateTime.Now, 0, "", "", 0, "", "", "");
        }

        private void ServerAgentForcedUnLoad()
        {
            isServerForceUnload = true;
            logService.Info("BeastConnectionManager", "ServerAgentForcedUnLoad", OperationCode.BeastConnectionForcedUnLoad, DateTime.Now, 0, "", "", 0, "", "", "");
        }

        #endregion

        //#region Beast Application Method

        //public void OpenApplication(IAppParameters appParameters)
        //{
        //    if (!isServerForceUnload)
        //    {
        //        if (isServerConnected)
        //        {
        //            applicationManager.OpenApplication(appParameters);
        //        }
        //    }
        //}

        //public void UpdateValueInApplication(IAppParameters appParameters)
        //{
        //    applicationManager.UpdateValueInApplication(appParameters);
        //}

        //public bool CloseApplication(ICloseAppParameters appParameters)
        //{
        //    return applicationManager.CloseApplication(appParameters);
        //}

        //#endregion
    }
}

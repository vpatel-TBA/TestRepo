using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Linq;
using System.Threading.Tasks;
using TBA.BeastModels.Parameters;
using TBA.BeastModels.User;
using TBA.BeastWebServer.Interfaces;
using TBA.BeastWebServer.Utilities;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.ConnectionServices
{
    [HubName("TBASignalRHub")]
    public class AppsDataHub : Hub
    {
        private readonly IApplicationManager applicationManager = null;
        private readonly ILogService logService = null;
        private readonly ISignalRResponseAdapter signalRResponseAdapter = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        private readonly IAuthenticationService authenticationService = null;

        public AppsDataHub(IApplicationManager applicationManager, ISignalRResponseAdapter signalRResponseAdapter, ILogService logService, ICacheAdaptor<UserInfo> cacheService, IAuthenticationService authenticationService)
        {
            this.applicationManager = applicationManager;
            this.signalRResponseAdapter = signalRResponseAdapter;
            this.logService = logService;
            this.cacheService = cacheService;
            this.authenticationService = authenticationService;
            logService.Debug("AppsDataHub", "AppsDataHub", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "");
        }

        #region SignalR Connection and Disconnection Method

        /// <summary>
        /// Event raised on connection success
        /// </summary>
        public override Task OnConnected()
        {
            logService.Info("AppsDataHub", "OnConnected", OperationCode.SignalRConnectionCreated, DateTime.Now, 0, Context.ConnectionId, Context.QueryString["token"], 0, "", "", "");
            return base.OnConnected();
        }

        /// <summary>
        /// Event raised on disconnection
        /// </summary>
        /// <param name="disconnectType">True, if disconnected due to a timeout. Else, false.</param>
        public override Task OnDisconnected(bool stopCalled)
        {
            string token = Context.QueryString["token"];
            try
            {
                logService.Info("AppsDataHub", "OnDisconnected", OperationCode.ConnectionRemoved, DateTime.Now, 0, Context.ConnectionId, token, 0, "", "", "");

                UserInfo userInfo = (UserInfo)cacheService.GetValueByKey(token);

                if (userInfo != null && userInfo.signalRConnectionList != null && userInfo.signalRConnectionList.Count > 0)
                {
                    SignalRConnection signalRConnection = userInfo.signalRConnectionList.FirstOrDefault(x => x.SignalRConnectionId == Context.ConnectionId);
                    if (signalRConnection != null && signalRConnection.ImageList != null && signalRConnection.ImageList.Count > 0)
                    {
                        for (int imageCount = 0; imageCount < signalRConnection.ImageList.Count; imageCount++)
                        {
                            CloseApplication(new CloseAppParameters() { AppSifId = signalRConnection.ImageList[imageCount].Id, AuthToken = token, EmailId = userInfo.EmailId, isFromDisconnect = true, AppMode = signalRConnection.ImageList[imageCount].Mode });
                        }

                        userInfo.signalRConnectionList.Remove(signalRConnection);
                        cacheService.Add(token, userInfo);
                    }
                }

                if (stopCalled)
                {
                    //TODO add logs if connection closed explicitly
                    //"Client {0} explicitly closed the connection."
                }
                else
                {
                    //TODO add logs if connection closed due to disconnect
                    //"Client {0} timed out ."
                }

            }
            catch (Exception exception)
            {
                logService.Error("ServiceController", "OnDisconnected", ExceptionCode.ConnectionRemovedFail, DateTime.Now, 0, Context.ConnectionId, token, 0, "", "", "", "", exception);
            }
            return base.OnDisconnected(stopCalled);
        }

        #endregion

        #region SignalR Join and Unjoin Group Method

        /// <summary>
        /// Request to join group passed in argument
        /// </summary>
        /// <param name="groupName">Name of the group to Join</param>
        public async Task JoinGroup(string groupName)
        {
            logService.Info("AppsDataHub", "JoinGroup", OperationCode.JoinGroup, DateTime.Now, 0, Context.ConnectionId, Context.QueryString["token"], 0, "", "", "Group Name : " + groupName);
            await Groups.Add(Context.ConnectionId, groupName);
        }

        /// <summary>
        /// Request to unjoin connection from group passed in argument
        /// </summary>
        /// <param name="groupName">Name of the group to unjoin</param>
        /// <param name="connectionId">Id to be removed from group</param>
        public async Task UnJoinGroup(string groupName, string connectionId)
        {
            logService.Info("AppsDataHub", "UnJoinGroup", OperationCode.UnJoinGroup, DateTime.Now, 0, Context.ConnectionId, Context.QueryString["token"], 0, "", "", "Group Name : " + groupName);
            await Groups.Remove(Context.ConnectionId, groupName);
        }

        /// <summary>
        /// Requested to unjoin group explicitly
        /// </summary>
        public void UnJoinGroupExplicit(AppParameters appParameters)
        {
            logService.Info("AppsDataHub", "UnJoinGroupExplicit", OperationCode.ExplicitUnJoinGroup, DateTime.Now, appParameters.UserId, Context.ConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, "");
            //Todo : create method
            throw new System.NotImplementedException();
        }

        #endregion

        #region Beast Application Related Method

        /// <summary>
        /// Request to Create Application in Beast
        /// </summary>
        public void CreateApplication(AppParameters appParameters)
        {
            try
            {
                logService.Debug("AppsDataHub", "CreateApplication", OperationCode.NA, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, "", appParameters.ClientType, appParameters.ClientVersion, "");

                //Logs added in individual methods so no need to add here.
                appParameters.SignalRConnectionId = Context.ConnectionId;
                Utility.SetApplicationKeyForAppParameters(appParameters);
                JoinGroup(appParameters.AppKey);

                if (authenticationService.AuthenticateRequest(appParameters.AuthToken, appParameters.EmailId))
                {
                    applicationManager.OpenApplication(appParameters);
                }
                else
                {
                    signalRResponseAdapter.SendTokenInvalidUpdate(appParameters.SignalRConnectionId);
                }
            }
            catch (Exception exception)
            {
                signalRResponseAdapter.SendExceptionDetail(appParameters.AppKey, "CreateApplicationError");
                UnJoinGroup(appParameters.AppKey, Context.ConnectionId);
                logService.Error("AppsDataHub", "CreateApplication", ExceptionCode.ApplicationCreateFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
            }
        }

        /// <summary>
        /// Set element value in application
        /// </summary>
        public void UpdateValueInApplication(AppParameters appParameters)
        {
            try
            {
                appParameters.SignalRConnectionId = Context.ConnectionId;
                Utility.SetApplicationKeyForAppParameters(appParameters);
                if (authenticationService.AuthenticateRequest(appParameters.AuthToken, appParameters.EmailId))
                {
                    applicationManager.UpdateValueInApplication(appParameters);
                    logService.Info("AppsDataHub", "UpdateValueInApplication", OperationCode.GetUpdated, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, "");
                }
                else
                {
                    signalRResponseAdapter.SendTokenInvalidUpdate(appParameters.SignalRConnectionId);
                }
            }
            catch (ApplicationException appicationException)
            {
                signalRResponseAdapter.SendExceptionDetail(appParameters.AppKey, "CreateUpdateValueError");
                logService.Error("AppsDataHub", "UpdateValueInApplication", ExceptionCode.GetUpdatedFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", appicationException);
            }
            catch (Exception exception)
            {
                signalRResponseAdapter.SendExceptionDetail(appParameters.AppKey, "UpdateValueError");
                logService.Error("AppsDataHub", "UpdateValueInApplication", ExceptionCode.GetUpdatedFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
            }
        }

        /// <summary>
        /// Requested to close application
        /// </summary>
        /// <param name="closeAppParameters">object of close app parameters</param>
        public void CloseApplication(CloseAppParameters closeAppParameters)
        {
            logService.Debug("AppsDataHub", "CloseApplication", OperationCode.NA, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, closeAppParameters.ClientVersion, "");
            try
            {
                closeAppParameters.SignalRConnectionId = Context.ConnectionId;
                Utility.SetApplicationKeyForCloseAppParameters(closeAppParameters);

                if (authenticationService.AuthenticateRequest(closeAppParameters.AuthToken, closeAppParameters.EmailId))
                {
                    applicationManager.CloseApplication(closeAppParameters);
                    if (!closeAppParameters.isFromDisconnect)
                        UnJoinGroup(closeAppParameters.AppKey, Context.ConnectionId);
                }
                else
                {
                    signalRResponseAdapter.SendTokenInvalidUpdate(closeAppParameters.SignalRConnectionId);
                }
            }
            catch (Exception exception)
            {
                signalRResponseAdapter.SendExceptionDetail(closeAppParameters.AppKey, "CloseApplicationError");
                UnJoinGroup(closeAppParameters.AppKey, Context.ConnectionId);
                logService.Error("AppsDataHub", "CloseApplication", ExceptionCode.ApplicationCloseFail, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, closeAppParameters.ClientVersion, "", exception);
            }
        }

        public void LogoutUser()
        {
            string token = Context.QueryString["token"];
            try
            {
                logService.Debug("AppsDataHub", "LogoutUser", OperationCode.NA, DateTime.Now, 0, "", token, 0, "", "", "", "");

                UserInfo userInfo = (UserInfo)cacheService.GetValueByKey(token);

                if (userInfo != null && userInfo.signalRConnectionList != null && userInfo.signalRConnectionList.Count > 0)
                {
                    for (int signalRConnectionCount = 0; signalRConnectionCount < userInfo.signalRConnectionList.Count; signalRConnectionCount++)
                    {
                        if (userInfo.signalRConnectionList != null && userInfo.signalRConnectionList[signalRConnectionCount].ImageList != null && userInfo.signalRConnectionList[signalRConnectionCount].ImageList.Count > 0)
                        {
                            for (int imageCount = 0; imageCount < userInfo.signalRConnectionList[signalRConnectionCount].ImageList.Count; imageCount++)
                            {
                                CloseApplication(new CloseAppParameters() { AppSifId = userInfo.signalRConnectionList[signalRConnectionCount].ImageList[imageCount].Id, EmailId = userInfo.EmailId, AuthToken = token, isFromDisconnect = true, AppMode = userInfo.signalRConnectionList[signalRConnectionCount].ImageList[imageCount].Mode });
                            }
                        }
                    }

                    cacheService.Remove(token);
                }

                logService.Info("AppsDataHub", "LogoutUser", OperationCode.Logout, DateTime.Now, 0, Context.ConnectionId, token, 0, "", "", "");
            }
            catch (Exception exception)
            {
                logService.Error("AppsDataHub", "CloseApplication", ExceptionCode.ApplicationCloseFail, DateTime.Now, 0, Context.ConnectionId, token, 0, "", "", "", "", exception);
            }
        }

        #endregion

    }
}

using BeastClientPlugIn;
using System;
using System.Collections.Generic;
using System.Linq;
using TBA.BeastModels.Application;
using TBA.BeastModels.Interface;
using TBA.BeastModels.User;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.Implementations
{
    public class ApplicationManager : IApplicationManager
    {
        private readonly Dictionary<string, IApplication> applications = null;
        private readonly ServerAgent serverAgent = null;
        private readonly IBeastConnectionManager beastConnectionManager = null;
        private readonly IApplicationFactory applicationFactory = null;
        private readonly ILogService logService = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        private readonly ISignalRResponseAdapter signalRResponseAdapter = null;

        public ApplicationManager(IBeastConnectionManager beastConnectionManager, ServerAgent serverAgent, IApplicationFactory applicationFactory, ILogService logService, ISignalRResponseAdapter signalRResponseAdapter, ICacheAdaptor<UserInfo> cacheService)
        {
            this.beastConnectionManager = beastConnectionManager;
            this.signalRResponseAdapter = signalRResponseAdapter;
            this.serverAgent = serverAgent;
            this.applicationFactory = applicationFactory;
            this.logService = logService;
            this.cacheService = cacheService;
            this.applications = new Dictionary<string, IApplication>();
        }

        public void OpenApplication(IAppParameters appParameters)
        {
            try
            {
                if (!beastConnectionManager.isServerForceUnload)
                {
                    if (beastConnectionManager.isServerConnected)
                    {
                        if (applications.ContainsKey(appParameters.AppKey))
                        {
                            applications[appParameters.AppKey].GetCachedApplicationData(appParameters);
                            SaveUserImageInfoInCache(appParameters, applications[appParameters.AppKey]);
                        }
                        else
                        {
                            CreateApplication(appParameters);
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "OpenApplication", ExceptionCode.ApplicationCreateFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
                throw;
            }
        }

        public void CloseApplication(ICloseAppParameters closeAppParameters)
        {
            try
            {
                if (applications.ContainsKey(closeAppParameters.AppKey))
                {
                    logService.Debug("ApplicationManager", "CloseApplication", OperationCode.NA, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, closeAppParameters.ClientVersion, "ApplicationExistInServerDictionary");

                    if (applications[closeAppParameters.AppKey].ReferenceCount > 0)
                    {
                        logService.Info("ApplicationManager", "CloseApplication", OperationCode.ApplicationReferenceDecrease, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, "ReferenceDecreased");
                        applications[closeAppParameters.AppKey].ReferenceCount--;
                    }
                    else
                    {
                        if (!string.IsNullOrWhiteSpace(applications[closeAppParameters.AppKey].AppParameters.AppInstanceId))
                        {
                            logService.Info("ApplicationManager", "CloseApplication", OperationCode.ApplicationClose, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, "ApplicationClosedInBeast");

                            applications[closeAppParameters.AppKey].Close();
                            serverAgent.CloseDocument("instid:" + applications[closeAppParameters.AppKey].AppParameters.AppInstanceId, null);
                            applications.Remove(closeAppParameters.AppKey);
                        }
                    }
                }
                else
                {
                    logService.Debug("ApplicationManager", "CloseApplication", OperationCode.NA, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, closeAppParameters.ClientVersion, "ApplicationNotExistInServerDictionary");
                }
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "CloseApplication", ExceptionCode.CloseApplicationFail, DateTime.Now, closeAppParameters.UserId, closeAppParameters.SignalRConnectionId, closeAppParameters.AuthToken, closeAppParameters.AppSifId, "", closeAppParameters.ClientType, closeAppParameters.ClientVersion, "", exception);
                throw;
            }
        }

        public void RemoveApplication(IAppParameters appParameters)
        {
            try
            {
                applications.Remove(appParameters.AppKey);
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "RemoveApplication", ExceptionCode.RemoveApplicationFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
            }
        }

        public void UpdateValueInApplication(IAppParameters appParameters)
        {
            object value = null;
            DOMDataDocument document = null;

            try
            {
                document = GetApplication(appParameters).ApplicationDoc;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "UpdateValueInApplication", ExceptionCode.ApplicationCreateFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
                throw;
            }

            try
            {
                int counter = 1;
                while (counter < 5)
                {
                    if (document.Status == DOMDataDocStatus.DATADOCSTATUS_ALIVE)
                    {
                        //Setting name for audit info, to display who had done what changes.
                        document.Name = appParameters.EmailId;
                        document.BeginGroupedUpdate();
                        DOMDataNode dataNode = document.get_NodeByID(appParameters.ElementId);
                        if (appParameters.ElementValue == "clr")
                        {
                            dataNode.DataState = DOMDataNodeValueState.DATANODEVALUESTATE_BLANK;
                        }
                        else
                        {
                            ValidateNodeValue(ref value, dataNode, appParameters.ElementValue);
                            dataNode.DataValue = value;
                        }
                        document.EndGroupedUpdate();
                        break;
                    }
                    counter++;
                }
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "UpdateValueInApplication", ExceptionCode.UpdateApplicationFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
                throw;
            }
        }

        private IApplication CreateApplication(IAppParameters appParameters)
        {
            try
            {
                IApplication application = applicationFactory.GetApplication(appParameters, serverAgent, RemoveApplication);
                application.Create(appParameters);
                SaveUserImageInfoInCache(appParameters, application);
                return application;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "CreateApplication", ExceptionCode.ApplicationCreateFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
                throw;
            }

        }

        private void SaveUserImageInfoInCache(IAppParameters appParameters, IApplication application)
        {
            logService.Debug("ApplicationManager", "SaveUserImageInfoInCache", OperationCode.NA, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, "", appParameters.ClientType, appParameters.ClientVersion, "ApplicationAlive :" + application.IsApplicationAlive);

            //Storing created or opened image in server memory's dictionary.
            applications[appParameters.AppKey] = application;

            //Storing user created or opened image in redis.
            UserInfo userInfo = (UserInfo)cacheService.GetValueByKey(appParameters.AuthToken);
            string InstanceID = application.ApplicationDoc.Name.Substring(application.ApplicationDoc.Name.IndexOf(':') + 1);
            if (userInfo != null)
            {
                if (userInfo.signalRConnectionList == null)
                {
                    userInfo.signalRConnectionList = new List<SignalRConnection>();

                    SignalRConnection signalRConnection = new SignalRConnection();
                    signalRConnection.SignalRConnectionId = appParameters.SignalRConnectionId;

                    signalRConnection.ImageList = new List<Image>();
                    signalRConnection.ImageList.Add(new Image() { ImageCreationTime = DateTime.UtcNow, Name = appParameters.AppName, Id = appParameters.AppId, InstanceId = InstanceID, LastActivityOn = DateTime.UtcNow, Mode = appParameters.AppMode });

                    userInfo.signalRConnectionList.Add(signalRConnection);

                    cacheService.Add(appParameters.AuthToken, userInfo);
                }
                else
                {
                    SignalRConnection signalRConnection = userInfo.signalRConnectionList.FirstOrDefault(x => x.SignalRConnectionId == appParameters.SignalRConnectionId);
                    if (signalRConnection == null)
                    {
                        signalRConnection = new SignalRConnection();
                        signalRConnection.SignalRConnectionId = appParameters.SignalRConnectionId;

                        signalRConnection.ImageList = new List<Image>();
                        signalRConnection.ImageList.Add(new Image() { ImageCreationTime = DateTime.UtcNow, Name = appParameters.AppName, Id = appParameters.AppId, InstanceId = InstanceID, LastActivityOn = DateTime.UtcNow, Mode = appParameters.AppMode });

                        userInfo.signalRConnectionList.Add(signalRConnection);

                        cacheService.Add(appParameters.AuthToken, userInfo);
                    }
                    else
                    {
                        signalRConnection.ImageList.Add(new Image() { ImageCreationTime = DateTime.UtcNow, Name = appParameters.AppName, Id = appParameters.AppId, InstanceId = InstanceID, LastActivityOn = DateTime.UtcNow, Mode = appParameters.AppMode });
                        cacheService.Add(appParameters.AuthToken, userInfo);
                    }
                }
            }
            else
            {
                logService.Info("ApplicationManager", "SaveUserImageInfoInCache", OperationCode.TokenInvalidUpdate, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, "", appParameters.ClientType, "Userinfo is null.");
                signalRResponseAdapter.SendTokenInvalidUpdate(appParameters.SignalRConnectionId);
            }
        }

        /// <summary>
        /// This method is used only to return application while updating data it does not contain send full update.
        /// </summary>
        /// <param name="appParameters"></param>
        /// <returns></returns>
        private IApplication GetApplication(IAppParameters appParameters)
        {
            try
            {
                if (applications.ContainsKey(appParameters.AppKey))
                {
                    return applications[appParameters.AppKey];
                }
                else
                {
                    return CreateApplication(appParameters);
                }
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationManager", "GetApplication", ExceptionCode.GetApplicationFail, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "", exception);
                throw;
            }
        }

        private void ValidateNodeValue(ref object value, DOMDataNode node, string elementValue)
        {
            if (null != node)
            {
                switch (node.DataType)
                {
                    case DOMDataNodeValueType.DATANODEVALUETYPE_INTEGER:
                        int integerValue;
                        if (int.TryParse(elementValue, out integerValue))
                            value = int.Parse(elementValue);
                        break;
                    case DOMDataNodeValueType.DATANODEVALUETYPE_DOUBLE:
                        decimal decimalValue;
                        if (decimal.TryParse(elementValue, out decimalValue))
                            value = double.Parse(elementValue);
                        break;
                    case DOMDataNodeValueType.DATANODEVALUETYPE_DATE:
                        DateTime dateValue;
                        if (DateTime.TryParse(elementValue, out dateValue))
                            value = DateTime.Parse(elementValue);
                        break;
                    default:
                        value = elementValue;
                        break;
                }
            }
        }
    }
}
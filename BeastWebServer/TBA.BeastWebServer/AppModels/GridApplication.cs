using BeastClientPlugIn;
using System;
using System.Collections.Concurrent;
using System.Data;
using TBA.BeastModels.Interface;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.AppModels
{
    public class GridApplication : IApplication
    {
        #region Private Variable

        private readonly ServerAgent serverAgent = null;
        private Action<IAppParameters> removeApplication = null;
        private readonly ISignalRResponseAdapter signalRResponseAdapter = null;
        private readonly ILogService logService = null;

        #endregion

        #region Properties

        public DOMDataDocument ApplicationDoc
        {
            get;
            set;
        }

        public bool IsApplicationAlive
        {
            get;
            set;
        }

        public bool IsApplicationStale
        {
            get;
            set;
        }

        public int ReferenceCount
        {
            get;
            set;
        }

        public IAppParameters AppParameters
        {
            get;
            set;
        }

        private ConcurrentDictionary<string, IResponseParameters> allFeildsCache
        {
            get;
            set;
        }

        private IResponseParameters responseParameters
        {
            get;
            set;
        }
        #endregion

        #region Constructor

        public GridApplication(IAppParameters appParameters, ServerAgent serverAgent, Action<IAppParameters> removeApplication, ISignalRResponseAdapter signalRResponseAdapter, IResponseParameters responseParameters, ILogService logService)
        {
            AppParameters = appParameters;
            this.serverAgent = serverAgent;
            this.removeApplication = removeApplication;
            this.responseParameters = responseParameters;
            this.signalRResponseAdapter = signalRResponseAdapter;
            this.logService = logService;
            allFeildsCache = new ConcurrentDictionary<string, IResponseParameters>();
            InitResponseParameters(appParameters);
        }

        #endregion

        #region Beast Application Related Method

        public void Create(IAppParameters appParameters)
        {
            try
            {
                Scripting.Dictionary properties = new Scripting.Dictionary();

                Object key = "ImpersonatedUser";
                Object value = appParameters.EmailId;
                properties.Add(ref key, ref value);

                key = "RequestFieldPropertiesAsNode";
                value = true;
                properties.Add(ref key, ref value);

                key = "OnlyVisible";
                value = 1;
                properties.Add(ref key, ref value);

                key = "RequestDisplayString";
                value = true;
                properties.Add(ref key, ref value);

                key = "RequestFieldProperties";
                value = false;
                properties.Add(ref key, ref value);

                key = "SID";
                value = appParameters.AppId;
                properties.Add(ref key, ref value);

                ApplicationDoc = serverAgent.RequestDocument("instid:" + appParameters.AppInstanceId, properties);

                ApplicationDoc.DocumentAlive += new _IDOMDataDocumentEvents_DocumentAliveEventHandler(ApplicationAlive);
                ApplicationDoc.DocumentChanged += new _IDOMDataDocumentEvents_DocumentChangedEventHandler(ApplicationDataChange);
                ApplicationDoc.DocumentStale += new _IDOMDataDocumentEvents_DocumentStaleEventHandler(ApplicationStale);
                ApplicationDoc.StatusChanged += new _IDOMDataDocumentEvents_StatusChangedEventHandler(ApplicationStatusChange);
            }
            catch (Exception exception)
            {
                logService.Error("GridApplication", "CreateApplicationInBeast", ExceptionCode.ApplicationCreateFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
                throw;
            }
        }

        private void InitResponseParameters(IAppParameters appParameters)
        {
            responseParameters.AppId = AppParameters.AppId;
            responseParameters.GroupName = AppParameters.AppKey;
            responseParameters.SignalRConnectionId = appParameters.SignalRConnectionId;
        }

        public void Close()
        {
            try
            {
                ApplicationDoc.DocumentAlive -= new _IDOMDataDocumentEvents_DocumentAliveEventHandler(ApplicationAlive);
                ApplicationDoc.DocumentChanged -= new _IDOMDataDocumentEvents_DocumentChangedEventHandler(ApplicationDataChange);
                ApplicationDoc.DocumentStale -= new _IDOMDataDocumentEvents_DocumentStaleEventHandler(ApplicationStale);
                ApplicationDoc.StatusChanged -= new _IDOMDataDocumentEvents_StatusChangedEventHandler(ApplicationStatusChange);
            }
            catch (Exception exception)
            {
                logService.Error("GridApplication", "Close", ExceptionCode.ApplicationUnloadFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
            finally
            {
                ApplicationDoc = null;
            }
        }

        #endregion

        private void ApplicationAlive()
        {
            IsApplicationAlive = true;
            try
            {
                AppParameters.AppInstanceId = ApplicationDoc.Name.Substring(ApplicationDoc.Name.IndexOf(':') + 1);
                serverAgent.LockDocument(ApplicationDoc.Name, null);
            }
            catch (Exception exception)
            {
                logService.Error("GridApplication", "ApplicationAlive", ExceptionCode.ApplicationInstanceNameSplitFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
            responseParameters.ElementValue = "true";

            signalRResponseAdapter.SendInstanceId(responseParameters.GroupName, AppParameters);

            logService.Info("GridApplication", "ApplicationAlive", OperationCode.ApplicationAlive, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, "");
        }

        private void ApplicationStatusChange(DOMDataDocStatus Status, string info)
        {
            try
            {
                if (Status == DOMDataDocStatus.DATADOCSTATUS_ERROR)
                {
                    IsApplicationAlive = false;
                    if (removeApplication != null)
                    {
                        removeApplication(AppParameters);
                    }

                    responseParameters.ElementValue = "false";
                    signalRResponseAdapter.SendApplicationStatusUpdates(responseParameters);
                }
                else if (Status == DOMDataDocStatus.DATADOCSTATUS_ALIVE)
                {
                    IsApplicationAlive = true;
                }
                else if (Status == DOMDataDocStatus.DATADOCSTATUS_NA)
                {
                    IsApplicationAlive = false;

                    responseParameters.ElementValue = "false";
                    signalRResponseAdapter.SendApplicationStatusUpdates(responseParameters);
                }
            }
            catch (Exception exception)
            {
                logService.Error("GridApplication", "ApplicationStatusChange", ExceptionCode.ApplicationStatusChangeFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
        }

        private void ApplicationStale()
        {
            IsApplicationStale = true;
            IsApplicationAlive = false;
            //TODO : when application is stale.
            responseParameters.ElementValue = "false";
            signalRResponseAdapter.SendApplicationStatusUpdates(responseParameters);
        }

        private void ApplicationDataChange(IDOMDataNodeList changedData)
        {
            try
            {
                DataTable dataTable = new DataTable();
                dataTable.Columns.Add("i");
                dataTable.Columns.Add("d");

                int totalUpdates = changedData.Length;

                for (int i = 0; i < totalUpdates; i++)
                {
                    switch (changedData[i].NodeName)
                    {
                        case "List":
                            string nName = changedData[i].NodeName;
                            string nValue = changedData[i].DataValue.ToString();
                            DOMDataNode prntNode = changedData[i].ParentNode;
                            DOMDataNodeList chlNode = changedData[i].ChildNodes;
                            DataRow listData = dataTable.NewRow();
                            listData["i"] = changedData[i].ParentNode.NodeID;
                            listData["d"] = nValue + "#" + changedData[i].ParentNode.DataValue;
                            dataTable.Rows.Add(listData);
                            break;
                        default:
                            DataRow defaultData = dataTable.NewRow();
                            defaultData["i"] = changedData[i].NodeID;
                            defaultData["d"] = changedData[i].DataValue;
                            dataTable.Rows.Add(defaultData);
                            break;
                    }


                }

                if (dataTable.Rows.Count > 0)
                {
                    signalRResponseAdapter.SendGridResponseToGroup(responseParameters.GroupName, dataTable);
                }
            }
            catch (Exception exception)
            {
                logService.Error("GridApplication", "ApplicationDataChange", ExceptionCode.GetUpdatedFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
        }

        #region Add or Update Value in cache

        void AddUpdateValueInValueStore(string nodeName, string nodeValue)
        {
            throw new NotImplementedException();
        }

        public void GetCachedApplicationData(IAppParameters appParameters)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}

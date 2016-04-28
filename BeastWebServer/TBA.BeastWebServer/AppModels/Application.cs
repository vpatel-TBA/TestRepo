using BeastClientPlugIn;
using System;
using System.Collections.Concurrent;
using TBA.BeastModels.Interface;
using TBA.BeastModels.Parameters;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.AppModels
{
    public class Application : IApplication
    {
        #region Private Variable

        private readonly ServerAgent serverAgent = null;
        private Action<IAppParameters> removeApplication = null;
        private readonly ISignalRResponseAdapter signalRResponseAdapter = null;
        private readonly ILogService logService = null;
        private string exportField = string.Empty;
        private string currentServerInfo = string.Empty;
        private int currentAuditTrailInfoLength = 0;
        private string currentDataAvailibilityInfo = string.Empty;

        private bool isCurrentServerInfoSet = false;

        #endregion

        #region Properties

        public string ExportField
        {
            get { return exportField; }
            set { exportField = value; }
        }

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
        /// <summary>
        /// All feilds is Cached in this dictionary for shared image updates.
        /// </summary>
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

        public Application(IAppParameters appParameters, ServerAgent serverAgent, Action<IAppParameters> removeApplication, ISignalRResponseAdapter signalRResponseAdapter, IResponseParameters responseParameters, ILogService logService)
        {
            AppParameters = appParameters;
            this.serverAgent = serverAgent;
            this.removeApplication = removeApplication;
            this.responseParameters = responseParameters;
            this.signalRResponseAdapter = signalRResponseAdapter;
            this.logService = logService;
            allFeildsCache = new ConcurrentDictionary<string, IResponseParameters>();
            InitResponseParameters(appParameters);
            logService.Debug("Application", "Application", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "");
        }

        #endregion

        #region Beast Application Related Method

        public void Create(IAppParameters appParameters)
        {
            try
            {
                logService.Info("Application", "Create", OperationCode.ApplicationCreate, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, "InstanceId:" + appParameters.AppInstanceId + " InitiatorEmailId:" + appParameters.InitiatorEmailId);

                Scripting.Dictionary properties = new Scripting.Dictionary();

                Object key = "ImpersonatedUser";
                Object value = string.IsNullOrWhiteSpace(appParameters.InitiatorEmailId) ? appParameters.EmailId : appParameters.InitiatorEmailId;
                properties.Add(ref key, ref value);

                key = "RequestFieldPropertiesAsNode";
                value = true;
                properties.Add(ref key, ref value);

                key = "OnlyVisible";
                value = 1;
                properties.Add(ref key, ref value);

                key = "RequestDisplayString";
                value = false;
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
                logService.Error("Application", "Create", ExceptionCode.ApplicationCreateFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
                throw;
            }
        }

        private void InitResponseParameters(IAppParameters appParameters)
        {
            logService.Debug("Application", "InitResponseParameters", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "");

            responseParameters.AppId = AppParameters.AppId;
            responseParameters.GroupName = AppParameters.AppKey;
            responseParameters.SignalRConnectionId = appParameters.SignalRConnectionId;
        }

        public void Close()
        {
            try
            {
                logService.Debug("Application", "Close", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "");

                ApplicationDoc.DocumentAlive -= new _IDOMDataDocumentEvents_DocumentAliveEventHandler(ApplicationAlive);
                ApplicationDoc.DocumentChanged -= new _IDOMDataDocumentEvents_DocumentChangedEventHandler(ApplicationDataChange);
                ApplicationDoc.DocumentStale -= new _IDOMDataDocumentEvents_DocumentStaleEventHandler(ApplicationStale);
                ApplicationDoc.StatusChanged -= new _IDOMDataDocumentEvents_StatusChangedEventHandler(ApplicationStatusChange);
            }
            catch (Exception exception)
            {
                logService.Error("Application", "Close", ExceptionCode.ApplicationUnloadFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
            finally
            {
                ApplicationDoc = null;
            }
        }

        #endregion

        #region Application Events

        private void ApplicationAlive()
        {
            try
            {
                logService.Debug("Application", "ApplicationAlive", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "");

                IsApplicationAlive = true;

                AppParameters.AppInstanceId = ApplicationDoc.Name.Substring(ApplicationDoc.Name.IndexOf(':') + 1);
                serverAgent.LockDocument(ApplicationDoc.Name, null);

                responseParameters.ElementValue = "true";

                signalRResponseAdapter.SendInstanceId(responseParameters.GroupName, AppParameters);
                AddUpdateInCacheDictionary("SendInstanceId", responseParameters);

                logService.Info("Application", "ApplicationAlive", OperationCode.ApplicationAlive, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, "");

            }
            catch (Exception exception)
            {
                logService.Error("Application", "ApplicationAlive", ExceptionCode.ApplicationInstanceNameSplitFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
        }

        private void ApplicationStatusChange(DOMDataDocStatus Status, string info)
        {
            try
            {
                logService.Debug("Application", "ApplicationStatusChange", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "Status: " + Status.ToString());

                if (Status == DOMDataDocStatus.DATADOCSTATUS_ERROR)
                {
                    IsApplicationAlive = false;
                    if (removeApplication != null)
                    {
                        removeApplication(AppParameters);
                    }

                    responseParameters.ElementValue = "false";
                    signalRResponseAdapter.SendApplicationStatusUpdates(responseParameters);
                    //AddUpdateInCacheDictionary("#StatusUpdates", responseParameters);
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
                    //AddUpdateInCacheDictionary("#StatusUpdates", responseParameters);
                }
            }
            catch (Exception exception)
            {
                logService.Error("Application", "ApplicationStatusChange", ExceptionCode.ApplicationStatusChangeFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
        }

        private void ApplicationStale()
        {
            logService.Debug("Application", "ApplicationStale", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "");

            IsApplicationStale = true;
            IsApplicationAlive = false;
            responseParameters.ElementValue = "false";
            signalRResponseAdapter.SendApplicationStatusUpdates(responseParameters);
            //AddUpdateInCacheDictionary("#ApplicationStale", responseParameters);
        }

        private void ApplicationDataChange(IDOMDataNodeList changedData)
        {
            logService.Debug("Application", "ApplicationDataChange", OperationCode.NA, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "");

            try
            {
                for (int i = 0; i < changedData.Length; i++)
                {
                    var _value = changedData[i].DataValue;

                    switch (changedData[i].NodeName)
                    {
                        case "7777777":     //For generic export data field. 7 times 7
                            //string nXMLName = changedData[i].NodeName;
                            //string nXMLValue = changedData[i].DataValue.ToString();
                            //ExportField = nXMLValue.ToString();
                            //_ExportField = nXMLValue.ToString();
                            break;

                        case "List":
                            responseParameters.ElementId = changedData[i].ParentNode.NodeID;
                            responseParameters.ElementValue = changedData[i].DataValue.ToString();
                            responseParameters.SelectedValue = changedData[i].ParentNode.DataValue.ToString();
                            signalRResponseAdapter.SendListUpdates(responseParameters);
                            AddUpdateInCacheDictionary(changedData[i].NodeName + "_" + changedData[i].ParentNode.NodeID, responseParameters);
                            break;
                        case "Properties":
                            //0 For normal updates, BLANK = 1, NA = 2 and ERROR = 3.
                            //V=1|M=1|E=1|F=2|R=-1|B=-1|T=50#121#USD.NY"
                            responseParameters.ElementId = changedData[i].ParentNode.NodeID;
                            responseParameters.ElementValue = changedData[i].DataValue.ToString();
                            signalRResponseAdapter.SendPropertyUpdates(responseParameters);
                            AddUpdateInCacheDictionary(changedData[i].NodeName + "_" + changedData[i].ParentNode.NodeID, responseParameters);
                            break;
                        case "ToolTip":
                            responseParameters.ElementId = changedData[i].ParentNode.NodeID;
                            DOMDataNode domDataNode = ApplicationDoc.get_NodeByID(responseParameters.ElementId);//.get_NamedChild("ToolTip");                                       
                            if (domDataNode.get_NamedChild("ToolTip") != null)
                            {
                                responseParameters.ElementValue = changedData[i].DataValue.ToString();
                                signalRResponseAdapter.SendToolTipUpdates(responseParameters);
                                AddUpdateInCacheDictionary(changedData[i].NodeName + "_" + changedData[i].ParentNode.NodeID, responseParameters);
                            }
                            break;
                        default:
                            //0 For normal updates, BLANK = 1, NA = 2 and ERROR = 3.
                            if (Convert.ToInt32(changedData[i].DataState) == 0)
                            {
                                responseParameters.ElementId = changedData[i].NodeName;
                                responseParameters.ElementValue = changedData[i].DataValue.ToString();
                                responseParameters.ElementDisplayValue = changedData[i].DisplayString.ToString();
                                signalRResponseAdapter.SendCommanUpdates(responseParameters);
                            }
                            else
                            {
                                responseParameters.ElementId = changedData[i].NodeName;
                                responseParameters.ElementValue = "";
                                responseParameters.ElementDisplayValue = "";
                                signalRResponseAdapter.SendCommanUpdates(responseParameters);
                            }
                            AddUpdateInCacheDictionary(changedData[i].NodeName, responseParameters);
                            break;
                    }
                }

                if (!isCurrentServerInfoSet)
                {
                    DOMDataNode appTitle = ApplicationDoc.get_NodeByID("AppTitle");
                    string serverInfo = appTitle.DataValue.ToString();

                    if (serverInfo != currentServerInfo)
                    {
                        serverInfo = appTitle.DataValue.ToString();
                        currentServerInfo = string.Copy(serverInfo);

                        if (serverInfo.Split(':')[0] == " " || serverInfo.Split(':')[0] == null)
                        {
                            logService.Info("Application", "ApplicationDataChange", OperationCode.TitleParseError, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, "BeastPluginErrorForTitle");
                        }

                        if (serverInfo.IndexOf('[') != -1)
                            responseParameters.ElementValue = serverInfo.Remove(serverInfo.IndexOf('['));
                        else
                            responseParameters.ElementValue = serverInfo;

                        signalRResponseAdapter.SendImageTitle(responseParameters);
                        AddUpdateInCacheDictionary("AppTitle", responseParameters);
                        isCurrentServerInfoSet = true;
                    }
                }

                //Getting image status data
                DOMDataNode dataAvailibilityInfo = ApplicationDoc.get_NodeByID("99999999");
                if (dataAvailibilityInfo != null)
                {
                    responseParameters.ElementValue = Convert.ToString(dataAvailibilityInfo.DataValue);
                    //Setting properties in display value so in single send we receive both value and properties.
                    if (dataAvailibilityInfo.get_NamedChild("Properties") != null && dataAvailibilityInfo.get_NamedChild("Properties").DataValue != null)
                    {
                        responseParameters.ElementDisplayValue = dataAvailibilityInfo.get_NamedChild("Properties").DataValue.ToString();
                        if (currentDataAvailibilityInfo != responseParameters.ElementDisplayValue)
                        {
                            signalRResponseAdapter.SendImageDataAvailabilityInfo(responseParameters);
                            AddUpdateInCacheDictionary("StatusUpdates", responseParameters);
                            currentDataAvailibilityInfo = responseParameters.ElementDisplayValue;
                        }
                    }
                }

                //Getting audit related data
                DOMDataNode auditTrailInfo = ApplicationDoc.get_NodeByID("99999991");
                if (auditTrailInfo != null)
                {
                    if (auditTrailInfo.DataValue != null)
                    {
                        responseParameters.ElementValue = auditTrailInfo.DataValue.ToString();
                        if (currentAuditTrailInfoLength != responseParameters.ElementValue.Length)
                        {
                            signalRResponseAdapter.SendAuditTrailInfo(responseParameters);
                            AddUpdateInCacheDictionary("AuditTrailInfo", responseParameters);
                            currentAuditTrailInfoLength = responseParameters.ElementValue.Length;
                        }
                    }
                }

                logService.Info("Application", "ApplicationDataChange", OperationCode.GetUpdated, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, "");
            }
            catch (Exception exception)
            {
                logService.Error("Application", "ApplicationDataChange", ExceptionCode.GetUpdatedFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
        }

        #endregion

        #region Add or Update Value in cache

        private void AddUpdateInCacheDictionary(string nodeName, IResponseParameters nodeValue)
        {
            allFeildsCache[nodeName] = DeepCopy(nodeValue);
        }

        private static ResponseParameters DeepCopy(IResponseParameters responseParameters)
        {
            return new ResponseParameters() { AppId = responseParameters.AppId, ElementDisplayValue = responseParameters.ElementDisplayValue, ElementId = responseParameters.ElementId, ElementType = responseParameters.ElementType, ElementValue = responseParameters.ElementValue, GroupName = responseParameters.GroupName, ResponseType = responseParameters.ResponseType, SelectedValue = responseParameters.SelectedValue, SignalRConnectionId = responseParameters.SignalRConnectionId };
        }

        public void GetCachedApplicationData(IAppParameters appParameters)
        {
            ReferenceCount++;
            logService.Info("ApplicationManager", "SendFullUpdateOfCachedApplication", OperationCode.ApplicationCreate, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, "SharedSignalRID" + appParameters.SharedSignalRConnectionId + "Group/Appkey:" + appParameters.AppKey + "CachedItemCount" + allFeildsCache.Count);

            foreach (var storedItem in allFeildsCache)
            {
                string type = storedItem.Key.Split('_')[0];
                switch (type)
                {
                    case "List":
                        signalRResponseAdapter.SendListUpdates((IResponseParameters)storedItem.Value);
                        break;
                    case "Properties":
                        signalRResponseAdapter.SendPropertyUpdates((IResponseParameters)storedItem.Value);
                        break;
                    case "ToolTip":
                        signalRResponseAdapter.SendToolTipUpdates((IResponseParameters)storedItem.Value);
                        break;
                    case "AppTitle":
                        signalRResponseAdapter.SendImageTitle((IResponseParameters)storedItem.Value);
                        break;
                    case "StatusUpdates":
                        signalRResponseAdapter.SendImageDataAvailabilityInfo((IResponseParameters)storedItem.Value);
                        break;
                    case "SendInstanceId":
                        signalRResponseAdapter.SendInstanceId(((IResponseParameters)storedItem.Value).GroupName, AppParameters);
                        break;
                    case "AuditTrailInfo":
                        signalRResponseAdapter.SendAuditTrailInfo((IResponseParameters)storedItem.Value);
                        break;
                    default:
                        signalRResponseAdapter.SendCommanUpdates((IResponseParameters)storedItem.Value);
                        break;
                }
            }
        }
        #endregion
    }
}
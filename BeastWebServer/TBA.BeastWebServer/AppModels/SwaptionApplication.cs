using BeastClientPlugIn;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using TBA.BeastModels.Interface;
using TBA.BeastModels.Parameters;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.AppModels
{
    public class SwaptionApplication : IApplication
    {
        #region Private Variable

        private readonly ServerAgent serverAgent = null;
        private Action<IAppParameters> removeApplication = null;
        private readonly ISignalRResponseAdapter signalRResponseAdapter = null;
        private readonly ILogService logService = null;
        private string currentServerInfo = string.Empty;
        private bool isCurrentServerInfoSet = false;
        private int currentAuditTrailInfoLength = 0;
        private string currentDataAvailibilityInfo = string.Empty;
        private string currentCcyTitle = string.Empty;
        private string currentStraddleTitle = string.Empty;
        private string currentVolsTitle = string.Empty;
        private string currentVolShiftTitle = string.Empty;



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

        private ConcurrentDictionary<string, string> allSwaptionDataCache
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

        public SwaptionApplication(IAppParameters appParameters, ServerAgent serverAgent, Action<IAppParameters> removeApplication, ISignalRResponseAdapter signalRResponseAdapter, IResponseParameters responseParameters, ILogService logService)
        {
            AppParameters = appParameters;
            this.serverAgent = serverAgent;
            this.removeApplication = removeApplication;
            this.responseParameters = responseParameters;
            this.signalRResponseAdapter = signalRResponseAdapter;
            this.logService = logService;
            allFeildsCache = new ConcurrentDictionary<string, IResponseParameters>();
            allSwaptionDataCache = new ConcurrentDictionary<string, string>();
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
                Object value = string.IsNullOrWhiteSpace(appParameters.InitiatorEmailId) ? appParameters.EmailId : appParameters.InitiatorEmailId;
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

                key = "AppDefs";
                value = appParameters.SignalRConnectionId;
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
                logService.Error("SwaptionApplication", "CreateApplicationInBeast", ExceptionCode.ApplicationCreateFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
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
                logService.Error("SwaptionApplication", "Close", ExceptionCode.ApplicationUnloadFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
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
                logService.Error("SwaptionApplication", "ApplicationAlive", ExceptionCode.ApplicationInstanceNameSplitFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
            responseParameters.ElementValue = "true";

            signalRResponseAdapter.SendInstanceId(responseParameters.GroupName, AppParameters);

            logService.Info("SwaptionApplication", "ApplicationAlive", OperationCode.ApplicationAlive, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, "");
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
                logService.Error("SwaptionApplication", "ApplicationStatusChange", ExceptionCode.ApplicationStatusChangeFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
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
                DataTable swaptionTable = new DataTable();
                swaptionTable.Columns.Add("Id");
                swaptionTable.Columns.Add("Data");

                int totalUpdates = changedData.Length;

                for (int i = 0; i < totalUpdates; i++)
                {
                    if (changedData[i].NodeName != "List")
                    {
                        DataRow defaultData = swaptionTable.NewRow();
                        defaultData["Id"] = changedData[i].NodeID;
                        defaultData["Data"] = changedData[i].DataValue;
                        swaptionTable.Rows.Add(defaultData);
                        AddUpdateInSwaptionDataCacheDictionary(changedData[i].NodeID, Convert.ToString(changedData[i].DataValue));
                    }
                }
                if (swaptionTable.Rows.Count > 0)
                {
                    signalRResponseAdapter.SendSwaptionData(responseParameters.GroupName, swaptionTable);
                }

                DOMDataNode ccyTitle = ApplicationDoc.get_NodeByID("1");
                if (ccyTitle != null)
                {
                    responseParameters.ElementId = "lblCurrency";
                    responseParameters.ElementValue = ccyTitle.DisplayString.ToString();
                    responseParameters.ElementDisplayValue = GetCurrencyValueTitleFromInteger(Convert.ToInt32(ccyTitle.DataValue));
                    if (!string.IsNullOrWhiteSpace(responseParameters.ElementValue) && currentCcyTitle != responseParameters.ElementDisplayValue)
                    {
                        signalRResponseAdapter.SendSwaptionTitleData(responseParameters);
                        AddUpdateInCacheDictionary("CcyTitle", responseParameters);
                        currentCcyTitle = responseParameters.ElementDisplayValue;
                    }
                }

                DOMDataNode straddleTitle = ApplicationDoc.get_NodeByID("100");
                if (straddleTitle != null)
                {
                    responseParameters.ElementId = "lblStraddle";
                    responseParameters.ElementValue = GetStraddleValueTitleFromInteger(Convert.ToInt32(straddleTitle.DataValue));
                    responseParameters.ElementDisplayValue = responseParameters.ElementValue;
                    if (!string.IsNullOrWhiteSpace(responseParameters.ElementValue) && currentStraddleTitle != responseParameters.ElementDisplayValue)
                    {
                        signalRResponseAdapter.SendSwaptionTitleData(responseParameters);
                        AddUpdateInCacheDictionary("StraddleTitle", responseParameters);
                        currentStraddleTitle = responseParameters.ElementDisplayValue;
                    }
                }

                DOMDataNode volsTitle = ApplicationDoc.get_NodeByID("52");
                if (volsTitle != null)
                {
                    responseParameters.ElementId = "lblVols";
                    responseParameters.ElementValue = volsTitle.DisplayString.ToString();
                    responseParameters.ElementDisplayValue = GetVolValueTitleFromInteger(Convert.ToInt32(volsTitle.DataValue));
                    if (!string.IsNullOrWhiteSpace(responseParameters.ElementValue) && currentVolsTitle != responseParameters.ElementDisplayValue)
                    {
                        signalRResponseAdapter.SendSwaptionTitleData(responseParameters);
                        AddUpdateInCacheDictionary("VolsTitle", responseParameters);
                        currentVolsTitle = responseParameters.ElementDisplayValue;
                    }
                }

                DOMDataNode volShiftTitle = ApplicationDoc.get_NodeByID("333");
                if (volShiftTitle != null)
                {
                    responseParameters.ElementId = "lblVolShift";
                    responseParameters.ElementValue = volShiftTitle.DisplayString.ToString();
                    responseParameters.ElementDisplayValue = GetVolShiftValueFromInteger(Convert.ToInt32(volShiftTitle.DataValue));
                    if (!string.IsNullOrWhiteSpace(responseParameters.ElementValue) && currentVolShiftTitle != responseParameters.ElementDisplayValue)
                    {
                        signalRResponseAdapter.SendSwaptionTitleData(responseParameters);
                        AddUpdateInCacheDictionary("VolShiftTitle", responseParameters);
                        currentVolShiftTitle = responseParameters.ElementDisplayValue;
                    }
                }

                //Title or where image created related information.
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
            }
            catch (Exception exception)
            {
                logService.Error("SwaptionApplication", "ApplicationDataChange", ExceptionCode.GetUpdatedFail, DateTime.Now, AppParameters.UserId, AppParameters.SignalRConnectionId, AppParameters.AuthToken, AppParameters.AppId, AppParameters.AppName, AppParameters.ClientType, AppParameters.ClientVersion, "", exception);
            }
        }

        #region Add or Update Value in cache

        private void AddUpdateInCacheDictionary(string nodeName, IResponseParameters nodeValue)
        {
            allFeildsCache[nodeName] = DeepCopy(nodeValue);
        }

        private static ResponseParameters DeepCopy(IResponseParameters responseParameters)
        {
            return new ResponseParameters() { AppId = responseParameters.AppId, ElementDisplayValue = responseParameters.ElementDisplayValue, ElementId = responseParameters.ElementId, ElementType = responseParameters.ElementType, ElementValue = responseParameters.ElementValue, GroupName = responseParameters.GroupName, ResponseType = responseParameters.ResponseType, SelectedValue = responseParameters.SelectedValue, SignalRConnectionId = responseParameters.SignalRConnectionId };
        }

        private void AddUpdateInSwaptionDataCacheDictionary(string nodeName, string nodeValue)
        {
            allSwaptionDataCache[nodeName] = nodeValue;
        }

        public void GetCachedApplicationData(IAppParameters appParameters)
        {
            ReferenceCount++;
            logService.Info("ApplicationManager", "SendFullUpdateOfCachedApplication", OperationCode.ApplicationCreate, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, "SharedSignalRID" + appParameters.SharedSignalRConnectionId + "Group/Appkey:" + appParameters.AppKey + "CachedItemCount" + allFeildsCache.Count);

            foreach (var storedItem in allFeildsCache)
            {
                switch (storedItem.Key)
                {
                    case "AppTitle":
                        signalRResponseAdapter.SendImageTitle(storedItem.Value);
                        break;
                    case "StatusUpdates":
                        signalRResponseAdapter.SendImageDataAvailabilityInfo(storedItem.Value);
                        break;
                    case "AuditTrailInfo":
                        signalRResponseAdapter.SendAuditTrailInfo(storedItem.Value);
                        break;
                    case "CcyTitle":
                    case "StraddleTitle":
                    case "VolsTitle":
                    case "VolShiftTitle":
                        signalRResponseAdapter.SendSwaptionTitleData(storedItem.Value);
                        break;
                }
            }

            if (allSwaptionDataCache.Count > 0)
            {
                DataTable swaptionTable = new DataTable();
                swaptionTable.Columns.Add("Id");
                swaptionTable.Columns.Add("Data");

                foreach (KeyValuePair<string, string> entry in allSwaptionDataCache)
                {
                    DataRow defaultData = swaptionTable.NewRow();
                    defaultData["Id"] = entry.Key;
                    defaultData["Data"] = entry.Value;
                    swaptionTable.Rows.Add(defaultData);
                }
                signalRResponseAdapter.SendSwaptionData(responseParameters.GroupName, swaptionTable);
            }
        }

        #endregion

        #region Swaption private methods for title

        private string GetStraddleValueTitleFromInteger(int id)
        {
            switch (id)
            {
                case 0:
                    return "None";
                case 1:
                    return "Payer";
                case 2:
                    return "Recv";
                case 3:
                    return "Straddle";
                default:
                    return "";
            }
        }

        private string GetCurrencyValueTitleFromInteger(int id)
        {
            switch (id)
            {
                case 21:
                    return "USD.EU :US (London) Eurodollar LIBOR Market";
                case 221:
                    return "USD.TK :US (Tokyo) TIBOR Market";
                case 6:
                    return "DEM.LN :Germany (London) LIBOR Market";
                case 406:
                    return "DEM  :Germany (Frankfurt) Domestic/FIBOR Market";
                case 22:
                    return "EUR.LN  :Euro (London) LIBOR Market";
                case 522:
                    return "EUR  :Euro EURIBOR Market";
                case 215:
                    return "JPY.TK  :Japan (Tokyo) Domestic/TIBOR Market";
                case 15:
                    return "JPY.EU  :Japan (London) LIBOR Market";
                case 1703:
                    return "CAD.DM  :Canada (Toronto) Domestic/BA Market";
                case 3:
                    return "CAD.EU  :Canada (London) LIBOR Market";
                case 11:
                    return "GBP :UK (London) Domestic/LIBOR Market";
                case 1404:
                    return "CHF.ZU  :Switzerland (Zurich) Domestic Market";
                case 4:
                    return "CHF.EU  :Switzerland (London) LIBOR Market";
                case 14:
                    return "ITL.LN  :Italy (London) LIBOR Market";
                case 2205:
                    return "CZK :Czech (Prague) Domestic/PRIBOR Market";
                case 807:
                    return "DKK :Denmark (Copenhagen) Domestic/CIBOR Market";
                case 917:
                    return "NOK :Norway (Oslo) Domestic/NIBOR(OIBOR) Market";
                case 1020:
                    return "SEK :Sweden (Stockholm) Domestic/STIBOR Market";
                case 2123:
                    return "ZAR :South Africa (Johannesburg) Domestic/BA Market";
                case 324:
                    return "SGD :Singapore (Singapore) Domestic/SIBOR Market";
                case 2325:
                    return "MXN :Mexico (Mexico City) Domestic Market";
                case 2527:
                    return "ARP :Argentina (Buenos Aires) Domestic/BAIBOR Market";
                case 2628:
                    return "TRL :Turkey (Ankara) Domestic Market";
                case 2729:
                    return "EEK :Estonia (Tallin) Domestic/TALIBOR Market";
                case 2830:
                    return "GRD :Greece (Athens) Domestic/ATHIBOR Market";
                case 2931:
                    return "HUF :Hungary (Budapest) Domestic/BUBOR Market";
                case 3032:
                    return "PLN :Poland (Warzawa) Domestic/WIBOR Market";
                case 3133:
                    return "RUB :Russia (Moskva) Domestic/MOWIBOR Market";
                case 3234:
                    return "BRL :Brazil (Brasilia) Domestic Market";
                default:
                    return "";
            }
        }

        private string GetVolValueTitleFromInteger(int id)
        {
            switch (id)
            {
                case 0:
                    return "Local";
                case 1:
                    return "Global";
                default:
                    return "";
            }
        }

        private string GetVolShiftValueFromInteger(int id)
        {
            switch (id)
            {
                case 0:
                    return "Off";
                case 1:
                    return "Percentage";
                case 2:
                    return "Parallel";
                case 3:
                    return "DK";
                default:
                    return "";
            }
        }

        #endregion

    }
}

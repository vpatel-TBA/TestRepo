using Microsoft.AspNet.SignalR;
using System;
using System.Data;
using TBA.BeastModels.Interface;
using TBA.BeastWebServer.ConnectionServices;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.Implementations
{
    public class SignalRResponseAdapter : ISignalRResponseAdapter
    {
        private readonly IHubContext hubContext = null;
        private readonly ILogService logService = null;

        public SignalRResponseAdapter(ILogService logService)
        {
            this.logService = logService;
            hubContext = GlobalHost.ConnectionManager.GetHubContext<AppsDataHub>();
            logService.Debug("SignalRResponseAdapter", "SignalRResponseAdapter", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "");
        }

        #region Basic Data Response Method

        public void SendTokenInvalidUpdate(string connection)
        {
            hubContext.Clients.Client(connection).InvalidTokenUpdate();
        }

        public void SendExceptionDetail(string groupName, string exception)
        {
            hubContext.Clients.Group(groupName).SendExceptionDetail(exception);
        }

        public void SendInstanceId(string groupName, IAppParameters appParameters)
        {
            hubContext.Clients.Group(groupName).SendInstanceId(appParameters);
        }

        public void SendApplicationStatusUpdates(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).ApplicationStatusUpdates(responseParameters);
        }

        public void SendListUpdates(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).ListUpdates(responseParameters);
        }

        public void SendPropertyUpdates(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).PropertiesUpdates(responseParameters);
        }

        public void SendToolTipUpdates(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).ToolTipUpdates(responseParameters);
        }

        public void SendCommanUpdates(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).CommanUpdates(responseParameters);
        }

        public void SendImageTitle(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).SetImageTitle(responseParameters);
        }

        public void SendImageDataAvailabilityInfo(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).SetImageDataAvailabilityInfo(responseParameters);
        }

        public void SendAuditTrailInfo(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).SetAuditTrailInfo(responseParameters);
        }

        #endregion

        #region Chart Data Response Method

        public void SendChartResponseToConnection(IResponseParameters responseParameters)
        {
            throw new System.NotImplementedException();
        }

        public void SendChartResponseToGroup(IResponseParameters responseParameters)
        {
            throw new System.NotImplementedException();
        }

        #endregion

        #region Grid Data Response Method

        public void SendGridResponseToConnection(IResponseParameters responseParameters)
        {
            throw new System.NotImplementedException();
        }

        public void SendGridResponseToGroup(string groupName, DataTable responseData)
        {
            hubContext.Clients.Group(groupName).SendInstanceId(responseData);
        }

        #endregion

        #region Swaption Grid Data Response Method

        public void SendSwaptionData(string groupName, DataTable responseData)
        {
            hubContext.Clients.Group(groupName).GetSwaptionDataUpdates(responseData);
        }

        public void SendSwaptionTitleData(IResponseParameters responseParameters)
        {
            hubContext.Clients.Group(responseParameters.GroupName).GetSwaptionTitleDataUpdates(responseParameters);
        }

        #endregion
    }
}

using System.Data;
using TBA.BeastModels.Interface;

namespace TBA.BeastWebServer.Interfaces
{
    public interface ISignalRResponseAdapter
    {
        #region Basic Data Response Method
        void SendTokenInvalidUpdate(string groupName);
        void SendExceptionDetail(string groupName, string exception);
        void SendInstanceId(string groupName, IAppParameters appParameters);
        void SendApplicationStatusUpdates(IResponseParameters responseParameters);
        void SendListUpdates(IResponseParameters responseParameters);
        void SendPropertyUpdates(IResponseParameters responseParameters);
        void SendToolTipUpdates(IResponseParameters responseParameters);
        void SendCommanUpdates(IResponseParameters responseParameters);
        void SendImageTitle(IResponseParameters responseParameters);
        void SendImageDataAvailabilityInfo(IResponseParameters responseParameters);
        void SendAuditTrailInfo(IResponseParameters responseParameters);

        #endregion

        #region Chart Data Response Method

        void SendChartResponseToConnection(IResponseParameters responseParameters);

        void SendChartResponseToGroup(IResponseParameters responseParameters);

        #endregion

        #region Grid Data Response Method

        void SendGridResponseToConnection(IResponseParameters responseParameters);

        void SendGridResponseToGroup(string groupName, DataTable responseData);

        #endregion

        #region Swaption Grid Data Response Method

        void SendSwaptionData(string groupName, DataTable responseData);
        void SendSwaptionTitleData(IResponseParameters responseParameters);
        #endregion
    }
}

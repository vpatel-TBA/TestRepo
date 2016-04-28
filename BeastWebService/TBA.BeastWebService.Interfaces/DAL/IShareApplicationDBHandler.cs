using System;
using System.Data;
using TBA.BeastModels.Application;
using TBA.BeastModels.User;

namespace TBA.BeastWebService.Interfaces.DAL
{
    public interface IShareApplicationDBHandler
    {
        int SubmitSharedApplication(UserInfo userInfo, DataTable autoUrlValues, DateTime defaultStart, DateTime defaultEnd, string instanceId, int sifId, string sharedSignalRId, string[] recieverEmails, string[] recieverPhoneNos, int expirationTime, string IpAddress);
        SharedApplicationDetails ValidateAndGetSharedAppDetail(string token);
        LocationInfo GetIPDetailsFromDB(string IPAddress);
        void SetIPDetailsInDB(LocationInfo locaionInfo);
    }
}

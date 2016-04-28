using TBA.BeastModels.Application;
using TBA.BeastModels.User;

namespace TBA.BeastWebService.Interfaces.BAL
{
    public interface IShareApplicationAccessLayer
    {
        string[] SubmitSharedApplication(UserInfo userInfo, int appId, string recieverEmails, string recieverPhoneNos, string token, string sharedSignalRId, string instanceId);
        SharedApplicationDetails ValidateAndGetSharedAppDetail(string token);
    }
}

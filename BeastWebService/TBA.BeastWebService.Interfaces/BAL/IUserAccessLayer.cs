using TBA.BeastModels.User;

namespace TBA.BeastWebService.Interfaces.BAL
{
    public interface IUserAccessLayer
    {
        ClientInfo ValidateUser(string userName, string password);
        string ChangeUserPassword(string userEmail, string oldPassword, string newPassword);
        string ForgotUserPassword(string userEmail, string oldPassword, string newPassword);
    }
}

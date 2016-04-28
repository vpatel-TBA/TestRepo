using TBA.BeastModels.User;

namespace TBA.BeastWebService.Interfaces.DAL
{
    public interface IUserDBHandler
    {
        ClientInfo ValidateUser(string userName, string password);
        int ChangeUserPassword(string userEmail, string oldPassword, string newPassword);
        int ForgotUserPassword(string userEmail, string oldPassword, string newPassword);
    }
}

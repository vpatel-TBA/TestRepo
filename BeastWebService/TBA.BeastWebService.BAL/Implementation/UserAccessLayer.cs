using System;
using TBA.BeastModels.User;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.BAL.Implementation
{
    public class UserAccessLayer : IUserAccessLayer
    {
        private readonly IUserDBHandler userDBHandler = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        private readonly ILogService logService = null;

        public UserAccessLayer(IUserDBHandler userDBHandler, ICacheAdaptor<UserInfo> cacheService, ILogService logService)
        {
            this.userDBHandler = userDBHandler;
            this.logService = logService;
            this.cacheService = cacheService;
        }

        public ClientInfo ValidateUser(string userName, string password)
        {
            logService.Debug("UserAccessLayer", "ValidateUser", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "UserName:" + userName);

            ClientInfo clientInfo = userDBHandler.ValidateUser(userName, password);

            if (clientInfo.IsSuccess)
            {
                clientInfo.Token = Guid.NewGuid().ToString();
                
                UserInfo userInfo = new UserInfo();
                userInfo.UserID = clientInfo.UserId;
                userInfo.EmailId = clientInfo.EmailId;
                userInfo.UserName = clientInfo.EmailId;
                userInfo.LoginTime = DateTime.UtcNow;

                logService.Info("UserAccessLayer", "ValidateUser", OperationCode.LoginSuccess, DateTime.Now, clientInfo.UserId, "", clientInfo.Token, 0, "", "", "Username : " + userName + " MessageId:" + clientInfo.MessageId);

                cacheService.Add(clientInfo.Token, userInfo);
            }
            else
            {
                logService.Info("UserAccessLayer", "ValidateUser", OperationCode.LoginFailed, DateTime.Now, clientInfo.UserId, "", clientInfo.Token, 0, "", "", "Username : " + userName + " MessageId:" + clientInfo.MessageId);

                switch (clientInfo.MessageId)
                {
                    case -100:
                        clientInfo.Message = "User is not registered.";
                        break;
                    case -200:
                        clientInfo.Message = "Account has been disabled.";
                        break;
                    case -300:
                        clientInfo.Message = "Invalid Password.";
                        break;
                    case -900:
                        clientInfo.Message = "Your Account has been locked.";
                        break;
                    default:
                        clientInfo.Message = "Error occured";
                        break;
                }
            }
            return clientInfo;
        }

        public string ChangeUserPassword(string userEmail, string oldPassword, string newPassword)
        {
            logService.Debug("UserAccessLayer", "ChangeUserPassword", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "", "UserEmail:" + userEmail);

            string returnMessage = string.Empty;
            int changePasswordFlag = userDBHandler.ChangeUserPassword(userEmail, oldPassword, newPassword);

            switch (changePasswordFlag)
            {
                case -2:
                    returnMessage = "User is not registered.";
                    break;
                case 1:
                    returnMessage = "Password Successfully Reset.";
                    break;
                default:
                    returnMessage = "Error occured.";
                    break;
            }
            return returnMessage;
        }

        public string ForgotUserPassword(string userEmail, string oldPassword, string newPassword)
        {
            logService.Debug("UserAccessLayer", "ForgotUserPassword", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "", "UserEmail:" + userEmail);

            string returnMessage = string.Empty;
            int changedPassword = userDBHandler.ForgotUserPassword(userEmail, oldPassword, newPassword);

            switch (changedPassword)
            {
                case -2:
                    returnMessage = "User is not registered.";
                    break;
                case 1:
                    returnMessage = "Password Successfully Reset.";
                    break;
                default:
                    returnMessage = "Error occured.";
                    break;
            }
            return returnMessage;
        }
    }
}

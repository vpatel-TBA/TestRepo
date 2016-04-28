using System;
using System.Data.SqlClient;
using System.Web.Http;
using TBA.BeastModels.Parameters;
using TBA.BeastModels.User;
using TBA.BeastWebService.Attributes;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.BeastWebService.Utilities;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.Controllers
{
    public class UserController : ApiController
    {
        private readonly IUserAccessLayer userAccessLayer = null;
        private readonly ILogService logService = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        public UserController(IUserAccessLayer userAccessLayer, ILogService logService, ICacheAdaptor<UserInfo> cacheService)
        {
            this.userAccessLayer = userAccessLayer;
            this.logService = logService;
            this.cacheService = cacheService;
        }

        /// <summary>
        /// Login or authentication user by username password
        /// </summary>
        /// <param name="loginParameters"></param>
        /// <returns></returns>
        [Route("api/User/SignIn")]
        [HttpGet]
        public ClientInfo SignIn([FromUri]LoginParameters loginParameters)
        {
            loginParameters.IpAddress = Utility.GetClientIPAddress();
            try
            {
                return userAccessLayer.ValidateUser(loginParameters.Username, loginParameters.Password);
            }
            catch (SqlException sqlException)
            {
                logService.Error("UserController", "SignIn", ExceptionCode.ValidateUserFail, DateTime.Now, 0, "", "", 0, "", "", "", "Username: " + loginParameters.Username + " IpAddress: " + loginParameters.IpAddress, sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("UserController", "SignIn", ExceptionCode.ValidateUserFail, DateTime.Now, 0, "", "", 0, "", "", "", "Username: " + loginParameters.Username + " IpAddress: " + loginParameters.IpAddress, exception);
                throw exception;
            }
        }

        /// <summary>
        /// Logout or remove user by token
        /// </summary>
        [Route("api/User/SignOut")]
        [HttpGet]
        public void SignOut(string token)
        {
            try
            {
               
            }
            catch (Exception exception)
            {
                logService.Error("UserController", "SignOut", ExceptionCode.ValidateUserFail, DateTime.Now, 0, "", "", 0, "", "", "", "", exception);

            }
        }

        // Todo : limit user or ip for some number of access to forget password to secure dos attack.
        /// <summary>
        /// Forgot password
        /// </summary>
        [Route("api/User/ForgotPassword")]
        [HttpPost]
        public string ForgotPassword(string userEmail)
        {
            logService.Debug("UserController", "ForgotPassword", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail: " + userEmail);

            Random randomNumber = new Random();
            string newPassword = Convert.ToString(randomNumber.Next(100000, 999999));
            try
            {
                return userAccessLayer.ForgotUserPassword(userEmail, "", Utility.ConvertToSMD5(newPassword));
            }
            catch (SqlException sqlException)
            {
                logService.Error("UserController", "ForgotPassword", ExceptionCode.ForgotUserPasswordFail, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail: " + userEmail, sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("UserController", "ForgotPassword", ExceptionCode.ForgotUserPasswordFail, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail: " + userEmail, exception);
                throw exception;
            }
        }

        /// <summary>
        /// Change password
        /// </summary>
        /// <param name="userEmail"></param>
        /// <param name="oldPassword"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        [Route("api/User/ChangePassword")]
        [TokenAuthorizationAttribute]
        [HttpPost]
        public string ChangePassword(string userEmail, string oldPassword, string newPassword)
        {
            logService.Debug("UserController", "ChangePassword", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail: " + userEmail);

            try
            {
                return userAccessLayer.ChangeUserPassword(userEmail, Utility.ConvertToSMD5(oldPassword), Utility.ConvertToSMD5(newPassword));
            }
            catch (SqlException sqlException)
            {
                logService.Error("UserController", "ChangePassword", ExceptionCode.ChangeUserPasswordFail, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail: " + userEmail, sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("UserController", "ChangePassword", ExceptionCode.ChangeUserPasswordFail, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail: " + userEmail, exception);
                throw exception;
            }
        }
    }
}

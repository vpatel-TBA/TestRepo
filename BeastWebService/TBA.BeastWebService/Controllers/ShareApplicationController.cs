using System;
using System.Data.SqlClient;
using System.Web.Http;
using TBA.BeastModels.Application;
using TBA.BeastModels.User;
using TBA.BeastWebService.Attributes;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.Controllers
{
    public class ShareApplicationController : ApiController
    {
        private readonly IShareApplicationAccessLayer shareApplicationAccessLayer = null;
        private readonly ILogService logService = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        public ShareApplicationController(IShareApplicationAccessLayer shareApplicationAccessLayer, ILogService logService, ICacheAdaptor<UserInfo> cacheService)
        {
            this.shareApplicationAccessLayer = shareApplicationAccessLayer;
            this.logService = logService;
            this.cacheService = cacheService;
        }

        //Todo : verify multiple parameters works or need to create class object for same.
        /// <summary>
        /// Submit shared application details.
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="recieverEmails"></param>
        /// <param name="token"></param>
        /// <param name="sharedSignalRId"></param>
        /// <param name="instanceId"></param>
        /// <returns></returns>
        [Route("api/ShareApplication")]
        [TokenAuthorizationAttribute]
        [HttpPost]
        public string[] SubmitSharedApplication(ShareApplication shareApplication)
        {
            string token = Request.Headers.Authorization.Parameter;

            logService.Debug("ShareApplicationController", "SubmitSharedApplication", OperationCode.NA, DateTime.Now, 0, shareApplication.sharedSignalRId, token, shareApplication.appId, "", "", "", "InstanceId:" + shareApplication.instanceId + " RecieverEmails:" + shareApplication.recieverEmails);

            try
            {
                UserInfo userInfo = (UserInfo)cacheService.GetValueByKey(token);
                return shareApplicationAccessLayer.SubmitSharedApplication(userInfo, shareApplication.appId, shareApplication.recieverEmails, shareApplication.recieverPhoneNos, token, shareApplication.sharedSignalRId, shareApplication.instanceId);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ShareApplicationController", "SubmitSharedApplication", ExceptionCode.SubmitSharedApplicationFail, DateTime.Now, 0, shareApplication.sharedSignalRId, token, shareApplication.appId, "", "", "", "", sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ShareApplicationController", "SubmitSharedApplication", ExceptionCode.SubmitSharedApplicationFail, DateTime.Now, 0, shareApplication.sharedSignalRId, token, shareApplication.appId, "", "", "", "", exception);
                throw exception;
            }
        }

        /// <summary>
        /// Validate and get shared app details of token.
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [Route("api/ShareApplication/{token}")]
        [HttpGet]
        public SharedApplicationDetails GetSharedApplicationDetails(string token)
        {
            string userEmail = "Token not present it will be created and email will be added later.";
            if (cacheService.ContainsKey(token))
            {
                userEmail = cacheService.GetValueByKey(token).EmailId;
                logService.Debug("ShareApplicationController", "ValidateAndGetSharedAppDetail", OperationCode.NA, DateTime.Now, 0, "", token, 0, "", "", "", "Email:" + userEmail);
            }
            else
            {
                logService.Debug("ShareApplicationController", "ValidateAndGetSharedAppDetail", OperationCode.NA, DateTime.Now, 0, "", token, 0, "", "", "", "Email:" + userEmail);
            }

            try
            {
                return shareApplicationAccessLayer.ValidateAndGetSharedAppDetail(token);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ShareApplicationController", "ValidateAndGetSharedAppDetail", ExceptionCode.ValidateAndGetSharedAppDetailFail, DateTime.Now, 0, "", token, 0, "", "", "", "Email:" + userEmail, sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ShareApplicationController", "ValidateAndGetSharedAppDetail", ExceptionCode.ValidateAndGetSharedAppDetailFail, DateTime.Now, 0, "", token, 0, "", "", "", "Email:" + userEmail, exception);
                throw exception;
            }
        }

        //// GET api/shareapplication
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/shareapplication/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/shareapplication
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/shareapplication/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/shareapplication/5
        //public void Delete(int id)
        //{
        //}
    }
}

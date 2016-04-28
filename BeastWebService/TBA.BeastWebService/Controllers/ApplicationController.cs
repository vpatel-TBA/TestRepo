using System;
using System.Collections.Generic;
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
    public class ApplicationController : ApiController
    {
        private readonly IApplicationAccessLayer applicationAccessLayer = null;
        private readonly ILogService logService = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        public ApplicationController(IApplicationAccessLayer applicationAccessLayer, ILogService logService, ICacheAdaptor<UserInfo> cacheService)
        {
            this.applicationAccessLayer = applicationAccessLayer;
            this.logService = logService;
            this.cacheService = cacheService;
        }

        /// <summary>
        /// GetApplicationList as per user.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/Application")]
        [TokenAuthorizationAttribute]
        [HttpGet]
        public IEnumerable<Image> GetApplications()
        {
            string token = Request.Headers.Authorization.Parameter;
            int userId = cacheService.GetValueByKey(token).UserID;

            logService.Debug("ApplicationController", "GetApplicationList", OperationCode.NA, DateTime.Now, userId, "", token, 0, "", "", "", "");
            try
            {
                return applicationAccessLayer.GetImageList(userId);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ApplicationController", "GetApplicationList", ExceptionCode.GetImageListFail, DateTime.Now, userId, "", token, 0, "", "", "", "", sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationController", "GetApplicationList", ExceptionCode.GetImageListFail, DateTime.Now, userId, "", token, 0, "", "", "", "", exception);
                throw exception;
            }
        }

        //Todo : confirm this will work or not
        /// <summary>
        /// Get application details
        /// </summary>
        /// <param name="sifId"></param>
        /// <returns></returns>
        [Route("api/Application/{ApplicationSifId}")]
        [TokenAuthorizationAttribute]
        [HttpGet]
        public Image GetApplicationDetail(int sifId)
        {
            string token = Request.Headers.Authorization.Parameter;
            int userId = cacheService.GetValueByKey(token).UserID;

            logService.Debug("ApplicationController", "GetApplicationDetail", OperationCode.NA, DateTime.Now, userId, "", token, sifId, "", "", "", "");
            try
            {
                return applicationAccessLayer.GetImageDetail(sifId);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ApplicationController", "GetApplicationDetail", ExceptionCode.GetImageDetailFail, DateTime.Now, userId, "", token, sifId, "", "", "", "", sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationController", "GetApplicationDetail", ExceptionCode.GetImageDetailFail, DateTime.Now, userId, "", token, sifId, "", "", "", "", exception);
                throw exception;
            }
        }

        /// <summary>
        /// GetLastOpenApplication of user
        /// Note: Need to take token in parameter to distinguish from first get() method.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/Application/user/")]
        [TokenAuthorization]
        [HttpGet]
        public Image GetLastOpenApplicationOfUser(string token)
        {
            int userId = cacheService.GetValueByKey(token).UserID;

            logService.Debug("ApplicationController", "GetLastOpenApplication", OperationCode.NA, DateTime.Now, userId, "", token, 0, "", "", "", "");
            try
            {
                return applicationAccessLayer.GetLastOpenImage(userId);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ApplicationController", "GetLastOpenApplication", ExceptionCode.GetLastOpenImageFail, DateTime.Now, userId, "", token, 0, "", "", "", "", sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationController", "GetLastOpenApplication", ExceptionCode.GetLastOpenImageFail, DateTime.Now, userId, "", token, 0, "", "", "", "", exception);
                throw exception;
            }
        }

        /// <summary>
        /// SetLastOpenApplication of user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="imageId"></param>
        /// <param name="imageInfo"></param>
        [Route("api/Application/user/")]
        [TokenAuthorizationAttribute]
        [HttpPost]
        public void SetLastOpenApplicationOfUser([FromBody]int imageId)
        {
            string token = Request.Headers.Authorization.Parameter;
            int userId = cacheService.GetValueByKey(token).UserID;
            string imageInfo = userId + "#" + imageId;

            logService.Debug("ApplicationController", "SetLastOpenApplication", OperationCode.NA, DateTime.Now, userId, "", "", imageId, "", "", "", "ImageInfo: " + imageInfo);

            try
            {
                applicationAccessLayer.SetLastOpenImage(userId, imageId, imageInfo);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ApplicationController", "SetLastOpenApplication", ExceptionCode.SetLastOpenImageFail, DateTime.Now, userId, "", "", imageId, "", "", "", "ImageInfo: " + imageInfo, sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationController", "SetLastOpenApplication", ExceptionCode.SetLastOpenImageFail, DateTime.Now, userId, "", "", imageId, "", "", "", "ImageInfo: " + imageInfo, exception);
                throw exception;
            }
        }

        //// GET api/application
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/application/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/application
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/application/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/application/5
        //public void Delete(int id)
        //{
        //}
    }
}

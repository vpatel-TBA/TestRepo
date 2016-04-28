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
    public class ApplicationCategoryController : ApiController
    {
        private readonly IApplicationCategoryAccessLayer applicationCategoryAccessLayer = null;
        private readonly ILogService logService = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        public ApplicationCategoryController(IApplicationCategoryAccessLayer applicationCategoryAccessLayer, ILogService logService, ICacheAdaptor<UserInfo> cacheService)
        {
            this.applicationCategoryAccessLayer = applicationCategoryAccessLayer;
            this.logService = logService;
            this.cacheService = cacheService;
        }

        /// <summary>
        /// Get application categories list as per user permission
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/ApplicationCategory")]
        [TokenAuthorizationAttribute]
        [HttpGet]
        public IEnumerable<Category> GetApplicationCategories()
        {
            string token = Request.Headers.Authorization.Parameter;
            int userId = cacheService.GetValueByKey(token).UserID;

            logService.Debug("ApplicationCategoryController", "GetCategories", OperationCode.NA, DateTime.Now, userId, "", token, 0, "", "", "", "");
            try
            {
                return applicationCategoryAccessLayer.GetCategories(userId);
            }
            catch (SqlException sqlException)
            {
                logService.Error("ApplicationCategoryController", "GetCategories", ExceptionCode.GetCategoriesFail, DateTime.Now, userId, "", token, 0, "", "", "", "", sqlException);
                throw sqlException;
            }
            catch (Exception exception)
            {
                logService.Error("ApplicationCategoryController", "GetCategories", ExceptionCode.GetCategoriesFail, DateTime.Now, userId, "", token, 0, "", "", "", "", exception);
                throw exception;
            }
        }

        //// GET api/applicationcategory
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/applicationcategory/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/applicationcategory
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/applicationcategory/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/applicationcategory/5
        //public void Delete(int id)
        //{
        //}
    }
}

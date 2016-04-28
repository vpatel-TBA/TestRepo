using System;
using System.Collections.Generic;
using TBA.BeastModels.Application;
using TBA.BeastModels.User;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.BAL.Implementation
{
    public class ApplicationCategoryAccessLayer : IApplicationCategoryAccessLayer
    {
        private readonly IApplicationCategoryDBHandler applicationCategoryDBHandler = null;
        private readonly ILogService logService = null;

        public ApplicationCategoryAccessLayer(IApplicationCategoryDBHandler applicationCategoryDBHandler, ICacheAdaptor<UserInfo> cacheService, ILogService logService, IConfigReader configReader)
        {
            this.applicationCategoryDBHandler = applicationCategoryDBHandler;
            this.logService = logService;
        }

        public IEnumerable<Category> GetCategories(int userId)
        {
            logService.Debug("ApplicationCategoryAccessLayer", "GetCategories", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "", "");
            return applicationCategoryDBHandler.GetCategories(userId);
        }
    }
}

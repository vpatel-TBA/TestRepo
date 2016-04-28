using System;
using System.Collections.Generic;
using TBA.BeastModels.Application;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.BAL.Implementation
{
    public class ApplicationAccessLayer : IApplicationAccessLayer
    {
        private readonly IApplicationDBHandler applicationDBHandler = null;
        private readonly ILogService logService = null;

        public ApplicationAccessLayer(IApplicationDBHandler applicationDBHandler, ILogService logService)
        {
            this.applicationDBHandler = applicationDBHandler;
            this.logService = logService;
        }

        public IEnumerable<Image> GetImageList(int userId)
        {
            logService.Debug("ApplicationAccessLayer", "GetImageList", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "", "");
            return applicationDBHandler.GetImageList(userId);
        }

        public Image GetLastOpenImage(int userId)
        {
            logService.Debug("ApplicationAccessLayer", "GetLastOpenImage", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "", "");
            return applicationDBHandler.GetLastOpenImage(userId);
        }

        public void SetLastOpenImage(int userId, int imageId, string imageInfo)
        {
            logService.Debug("ApplicationAccessLayer", "SetLastOpenImage", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "UserId:" + userId + " ImageId:" + imageId + " ImageInfo:" + imageInfo);
            applicationDBHandler.SetLastOpenImage(userId, imageId, imageInfo);
        }

        public Image GetImageDetail(int sifId)
        {
            logService.Debug("ApplicationAccessLayer", "GetImageDetail", OperationCode.NA, DateTime.Now, 0, "", "", sifId, "", "", "", "");
            return applicationDBHandler.GetImageDetail(sifId);
        }
    }
}

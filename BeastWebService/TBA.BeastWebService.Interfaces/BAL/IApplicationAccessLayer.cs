using System.Collections.Generic;
using TBA.BeastModels.Application;

namespace TBA.BeastWebService.Interfaces.BAL
{
    public interface IApplicationAccessLayer
    {
        IEnumerable<Image> GetImageList(int userId);
        Image GetLastOpenImage(int userId);
        void SetLastOpenImage(int userId, int imageSifId, string imageInfo);
        Image GetImageDetail(int sifId);
    }
}

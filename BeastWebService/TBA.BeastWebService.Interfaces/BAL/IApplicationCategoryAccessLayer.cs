using System.Collections.Generic;
using TBA.BeastModels.Application;

namespace TBA.BeastWebService.Interfaces.BAL
{
    public interface IApplicationCategoryAccessLayer
    {
        IEnumerable<Category> GetCategories(int userId);
    }
}

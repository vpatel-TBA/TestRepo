using System.Collections.Generic;
using TBA.BeastModels.Application;

namespace TBA.BeastWebService.Interfaces.DAL
{
    public interface IApplicationCategoryDBHandler
    {
        IEnumerable<Category> GetCategories(int userId);
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using TBA.BeastModels.Application;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.DAL.Implementation
{
    public class ApplicationCategoryDBHandler : IApplicationCategoryDBHandler
    {
       
        private readonly ILogService logService = null;
        private readonly IConfigReader configReader = null;

        public ApplicationCategoryDBHandler(ILogService logService, IConfigReader configReader)
        {
            this.logService = logService;
            this.configReader = configReader;
        }

        public IEnumerable<Category> GetCategories(int userId)
        {
            logService.Debug("ApplicationCategoryDBHandler", "GetCategories", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "", "");

            List<Category> categories = null;
            SqlConnection sqlConnection = null;
            Category category = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Web_Get_AppStore_ImageCategory"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@p_UserId", userId);

                        sqlConnection.Open();
                        SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                        if (sqlDataReader.HasRows)
                        {
                            categories = new List<Category>();
                            while (sqlDataReader.Read())
                            {
                                category = new Category();
                                category.Id = Convert.ToInt32(sqlDataReader["CategoryId"]);
                                category.Name = Convert.ToString(sqlDataReader["CategoryName"]);
                                categories.Add(category);
                            }
                        }
                        sqlConnection.Close();
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State == ConnectionState.Open)
                    sqlConnection.Close();
            }
            return categories;
        }
    }
}

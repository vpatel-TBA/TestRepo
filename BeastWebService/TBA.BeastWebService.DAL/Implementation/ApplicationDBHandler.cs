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
    public class ApplicationDBHandler : IApplicationDBHandler
    {
        private readonly ILogService logService = null;
        private readonly IConfigReader configReader = null;

        public ApplicationDBHandler(ILogService logService, IConfigReader configReader)
        {
            this.logService = logService;
            this.configReader = configReader;
        }

        public IEnumerable<Image> GetImageList(int userId)
        {
            logService.Debug("ApplicationDBHandler", "GetImageList", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "", "");

            List<Image> images = null;
            SqlConnection sqlConnection = null;
            Image image = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString ))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Get_AppStore_AppList_ByCategory"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@p_UserId", userId);

                        sqlConnection.Open();
                        SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

                        if (sqlDataReader.HasRows)
                        {
                            images = new List<Image>();
                            while (sqlDataReader.Read())
                            {
                                image = new Image();
                                image.Id = Convert.ToInt32(sqlDataReader["BeastImageSID"]);
                                image.Name = Convert.ToString(sqlDataReader["AppTitle"]);
                                image.CategoryId = Convert.ToInt32(sqlDataReader["CategoryId"]);
                                image.Type = Convert.ToInt16(sqlDataReader["AppType"]);
                                image.Mode= Convert.ToInt16(sqlDataReader["AppMode"]);
                                images.Add(image);
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
            return images;
        }

        public Image GetLastOpenImage(int userId)
        {
            logService.Debug("ApplicationDBHandler", "GetLastOpenImage", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "", "");

            Image image = null;
            SqlConnection sqlConnection = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Get_Appstore_User_LastInstance_New"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@p_UserId", userId);

                        sqlConnection.Open();
                        SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                        if (sqlDataReader.HasRows)
                        {
                            image = new Image();
                            while (sqlDataReader.Read())
                            {
                                image.Id = Convert.ToInt32(sqlDataReader["ImageId"]);
                                image.Name = Convert.ToString(sqlDataReader["ImageName"]);
                                image.CategoryId = Convert.ToInt32(sqlDataReader["CategoryId"]);
                                image.Type = Convert.ToInt16(sqlDataReader["AppType"]);
                                image.Mode = Convert.ToInt16(sqlDataReader["AppMode"]);
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
            return image;
        }

        public void SetLastOpenImage(int userId, int imageId, string imageInfo)
        {
            logService.Debug("ApplicationDBHandler", "SetLastOpenImage", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "UserId:" + userId + " ImageId:" + imageId + " ImageInfo:" + imageInfo);

            SqlConnection sqlConnection = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Submit_Appstore_User_LastInstance"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@p_UserId", userId);
                        sqlCommand.Parameters.AddWithValue("@p_InstanceId", imageId);
                        sqlCommand.Parameters.AddWithValue("@p_InstanceInfo", imageInfo);

                        sqlConnection.Open();
                        sqlCommand.ExecuteNonQuery();
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
        }

        public Image GetImageDetail(int sifId)
        {
            logService.Debug("ApplicationDBHandler", "GetImageDetail", OperationCode.NA, DateTime.Now, 0, "", "", sifId, "", "", "", "");

            SqlConnection sqlConnection = null;
            Image image = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Web_AppStore_Get_Image_dtl", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add(new SqlParameter("@P_SIFID", sifId));
                        sqlConnection.Open();
                        using (SqlDataReader sqlReader = sqlCommand.ExecuteReader())
                        {
                            if (sqlReader.Read())
                            {
                                image = new Image();
                                image.Name = Convert.ToString(sqlReader["AppTitle"]);
                                image.Type = Convert.ToInt16(sqlReader["AppType"]);
                                image.Mode= Convert.ToInt16(sqlReader["AppMode"]);
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
            return image;
        }
    }
}

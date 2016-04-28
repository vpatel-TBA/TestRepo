using System;
using System.Data;
using System.Data.SqlClient;
using TBA.BeastModels.User;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.DAL.Implementation
{
    public class UserDBHandler : IUserDBHandler
    {
        private readonly ILogService logService = null;
        private readonly IConfigReader configReader = null;

        public UserDBHandler(ILogService logService, IConfigReader configReader)
        {
            this.logService = logService;
            this.configReader = configReader;
        }

        public ClientInfo ValidateUser(string userName, string password)
        {
            logService.Debug("UserDBHandler", "ValidateUser", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "UserName:" + userName, "");

            ClientInfo clientInfo = null;
            SqlConnection sqlConnection = null;

            try
            {
                using (sqlConnection = new SqlConnection(configReader.SessionServerConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Web_User_Validate"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@p_LoginId", userName);
                        sqlCommand.Parameters.AddWithValue("@p_Password", password);

                        sqlConnection.Open();
                        SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

                        if (sqlDataReader.HasRows)
                        {
                            clientInfo = new ClientInfo();
                            while (sqlDataReader.Read())
                            {
                                if (Convert.ToInt32(sqlDataReader["MsgId"]) == 1)
                                {
                                    clientInfo.IsSuccess = true;
                                    clientInfo.MessageId = 1;
                                    clientInfo.CustomerId = Convert.ToInt32(sqlDataReader["CustomerId"]);
                                    clientInfo.FirstName = Convert.ToString(sqlDataReader["FirstName"]);
                                    clientInfo.LastName = Convert.ToString(sqlDataReader["LastName"]);
                                }
                                else
                                {
                                    clientInfo.IsSuccess = false;
                                    clientInfo.MessageId = Convert.ToInt32(sqlDataReader["MsgId"]);
                                }
                                clientInfo.UserId = Convert.ToInt32(sqlDataReader["UserId"]);
                                clientInfo.EmailId = Convert.ToString(sqlDataReader["EmailId"]);
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

            return clientInfo;
        }

        public int ChangeUserPassword(string userEmail, string oldPassword, string newPassword)
        {
            logService.Debug("UserDBHandler", "ChangeUserPassword", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "UserEmail:" + userEmail);

            SqlConnection sqlConnection = null;
            int changedPassword = 0;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.SessionServerConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Web_Submit_NewAppStore_User_Pwd_Changes"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@P_Email", userEmail);
                        sqlCommand.Parameters.AddWithValue("@P_Passowrd", oldPassword);
                        sqlCommand.Parameters.AddWithValue("@P_NewPassowrd", newPassword);

                        sqlConnection.Open();
                        SqlParameter returnCode = sqlCommand.Parameters.Add("@P_return", SqlDbType.Int);
                        returnCode.Direction = ParameterDirection.ReturnValue;
                        sqlCommand.ExecuteNonQuery();
                        changedPassword = Convert.ToInt32(returnCode.Value);
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

            return changedPassword;
        }

        public int ForgotUserPassword(string userEmail, string oldPassword, string newPassword)
        {
            logService.Debug("UserDBHandler", "ForgotUserPassword", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "", "UserEmail:" + userEmail);

            SqlConnection sqlConnection = null;
            int changedPassword = 0;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.SessionServerConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Web_Submit_NewAppStore_User_Pwd_Changes"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@P_Email", userEmail);
                        sqlCommand.Parameters.AddWithValue("@P_Passowrd", oldPassword);
                        sqlCommand.Parameters.AddWithValue("@P_NewPassowrd", newPassword);

                        sqlConnection.Open();
                        SqlParameter returnCode = sqlCommand.Parameters.Add("@P_return", SqlDbType.Int);
                        returnCode.Direction = ParameterDirection.ReturnValue;
                        sqlCommand.ExecuteNonQuery();
                        changedPassword = Convert.ToInt32(returnCode.Value);
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
            return changedPassword;
        }
    }
}
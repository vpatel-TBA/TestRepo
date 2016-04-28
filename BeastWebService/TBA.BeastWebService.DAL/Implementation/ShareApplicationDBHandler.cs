using System;
using System.Data;
using System.Data.SqlClient;
using TBA.BeastModels.Application;
using TBA.BeastModels.User;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.DAL.Implementation
{
    public class ShareApplicationDBHandler : IShareApplicationDBHandler
    {
        private readonly ILogService logService = null;
        private readonly IConfigReader configReader = null;

        public ShareApplicationDBHandler(ILogService logService, IConfigReader configReader)
        {
            this.logService = logService;
            this.configReader = configReader;
        }

        public int SubmitSharedApplication(UserInfo userInfo, DataTable autoUrlValues, DateTime startDate, DateTime endDate, string instanceId, int sifId, string sharedSignalRId, string[] recieverEmails, string[] recieverPhoneNos, int expirationTime, string ipAddress)
        {
            logService.Debug("ShareApplicationDBHandler", "SubmitSharedApplication", OperationCode.NA, DateTime.Now, userInfo.UserID, sharedSignalRId, "", sifId, "", "", "", "InstanceId:" + instanceId + " RecieverEmails:" + recieverEmails + " RecieverPhoneNos:" + recieverPhoneNos);

            SqlConnection sqlConnection = null;
            int returnResult = 0;
            string moveToPage = "SharedApp";
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Submit_AppStore_AutoURL"))
                    {
                        sqlCommand.Connection = sqlConnection;
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@p_AutoURL", autoUrlValues);
                        sqlCommand.Parameters.AddWithValue("@p_UserId", userInfo.UserID);
                        sqlCommand.Parameters.AddWithValue("@p_StartDate", startDate);
                        sqlCommand.Parameters.AddWithValue("@p_EndDate", endDate);
                        sqlCommand.Parameters.AddWithValue("@p_MovetoPage", moveToPage);
                        sqlCommand.Parameters.AddWithValue("@p_SuccessFlag", 0);
                        sqlCommand.Parameters.AddWithValue("@p_IpAddress", ipAddress);
                        sqlCommand.Parameters.AddWithValue("@p_MinuteInterval", expirationTime);
                        sqlCommand.Parameters.AddWithValue("@p_InstanceId", instanceId);
                        sqlCommand.Parameters.AddWithValue("@P_SifId", sifId);
                        sqlCommand.Parameters.AddWithValue("@P_SharedSignalRId", sharedSignalRId);

                        sqlConnection.Open();
                        returnResult = sqlCommand.ExecuteNonQuery();
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
            return returnResult;
        }

        public SharedApplicationDetails ValidateAndGetSharedAppDetail(string token)
        {
            logService.Debug("ShareApplicationDBHandler", "ValidateAndGetSharedAppDetail", OperationCode.NA, DateTime.Now, 0, "", token, 0, "", "", "", "");

            SqlConnection sqlConnection = null;
            SharedApplicationDetails sharedApplicationDetails = null;

            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Get_AppStore_AutoURL_Validate", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@p_AutoURLId", SqlDbType.VarChar);
                        sqlCommand.Parameters["@p_AutoURLId"].Value = token;

                        sqlConnection.Open();

                        SqlDataReader autoUrlInfo = sqlCommand.ExecuteReader();

                        if (autoUrlInfo.HasRows)
                        {
                            sharedApplicationDetails = new SharedApplicationDetails();
                            while (autoUrlInfo.Read())
                            {
                                sharedApplicationDetails.ExtendedStatus = Convert.ToInt32(autoUrlInfo["successflag"]);
                                sharedApplicationDetails.ExtendedOperationMessage = Convert.ToString(autoUrlInfo["successflagMsg"]);

                                if (autoUrlInfo.NextResult())
                                {
                                    while (autoUrlInfo.Read())
                                    {
                                        sharedApplicationDetails.AutoURLId = autoUrlInfo["AutoURLId"].ToString();
                                        sharedApplicationDetails.AutoURL = autoUrlInfo["AutoURL"].ToString();
                                        sharedApplicationDetails.InitiatorUserId = Convert.ToString(autoUrlInfo["InitiatorUserId"]);
                                        sharedApplicationDetails.EmailId = Convert.ToString(autoUrlInfo["EmailId"]);
                                        sharedApplicationDetails.PhoneNo = Convert.ToString(autoUrlInfo["PhoneNo"]);
                                        sharedApplicationDetails.MovetoPage = Convert.ToString(autoUrlInfo["MovetoPage"]);
                                        sharedApplicationDetails.InstanceId = autoUrlInfo["InstanceId"].ToString();
                                        sharedApplicationDetails.SifId = Convert.ToInt32(autoUrlInfo["SifId"]);
                                        sharedApplicationDetails.SharedSignalRId = autoUrlInfo["SharedSignalRId"].ToString();
                                        sharedApplicationDetails.IsValid = Convert.ToBoolean(autoUrlInfo["IsValidFlag"]);
                                        sharedApplicationDetails.AutoURLUserId = Convert.ToInt32(autoUrlInfo["AutoURLUserId"]);
                                        sharedApplicationDetails.MessageId = Convert.ToInt32(autoUrlInfo["MsgId"]);
                                        sharedApplicationDetails.Message = Convert.ToString(autoUrlInfo["Msg"]);
                                        sharedApplicationDetails.InitiatorEmailId = autoUrlInfo["InitiatorEmailId"].ToString();
                                        sharedApplicationDetails.InitiatorName = Convert.ToString(autoUrlInfo["InitiatorName"]);
                                        sharedApplicationDetails.StartDate = Convert.ToDateTime(autoUrlInfo["StartDate"]);
                                        sharedApplicationDetails.EndDate = Convert.ToDateTime(autoUrlInfo["EndDate"]);
                                    }
                                }
                            }
                        }
                    }
                    sqlConnection.Close();
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
            return sharedApplicationDetails;
        }

        public LocationInfo GetIPDetailsFromDB(string ipAddress)
        {
            LocationInfo locationInfo = null;
            SqlConnection sqlConnection = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Get_Goip_Location_Dtl", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@P_IPAddress", SqlDbType.VarChar).Value = ipAddress;

                        sqlConnection.Open();

                        SqlDataReader locationDetail = sqlCommand.ExecuteReader();
                        if (locationDetail.HasRows)
                        {
                            locationInfo = new LocationInfo();
                            while (locationDetail.Read())
                            {
                                locationInfo.Organization = Convert.ToString(locationDetail["Organization"]);
                                locationInfo.ISP = Convert.ToString(locationDetail["ISP"]);
                                locationInfo.City = Convert.ToString(locationDetail["City"]);
                                locationInfo.Region = Convert.ToString(locationDetail["Region"]);
                                locationInfo.RegionCode = Convert.ToString(locationDetail["RegionCode"]);
                                locationInfo.Country = Convert.ToString(locationDetail["Country"]);
                                locationInfo.CountryCode = Convert.ToString(locationDetail["CountryCode"]);
                                locationInfo.Zipcode = Convert.ToString(locationDetail["Zipcode"]);
                                locationInfo.Longitude = Convert.ToString(locationDetail["Logintude"]);
                                locationInfo.Latitude = Convert.ToString(locationDetail["Latitude"]);
                                locationInfo.TimeZone = Convert.ToString(locationDetail["TimeZone"]);
                                locationInfo.HostName = Convert.ToString(locationDetail["HostName"]);
                                locationInfo.IPAddress = Convert.ToString(locationDetail["IPAddress"]);
                                locationInfo.StatusDate = Convert.ToDateTime(locationDetail["StatusDate"]);
                                locationInfo.StatusInfo = Convert.ToString(locationDetail["StatusInfo"]);
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

            return locationInfo;
        }

        public void SetIPDetailsInDB(LocationInfo locaionInfo)
        {
            SqlConnection sqlConnection = null;
            try
            {
                using (sqlConnection = new SqlConnection(configReader.AppStoreConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("Proc_Submit_Goip_Location_Dtl", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        if (string.IsNullOrWhiteSpace(locaionInfo.Organization))
                        {
                            sqlCommand.Parameters.Add("@P_Organization", SqlDbType.VarChar).Value = locaionInfo.Organization;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_Organization", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.ISP))
                        {
                            sqlCommand.Parameters.Add("@P_ISP", SqlDbType.VarChar).Value = locaionInfo.ISP;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_ISP", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.City))
                        {
                            sqlCommand.Parameters.Add("@P_City", SqlDbType.VarChar).Value = locaionInfo.City;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_City", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.Region))
                        {
                            sqlCommand.Parameters.Add("@P_Region", SqlDbType.VarChar).Value = locaionInfo.Region;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_Region", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.RegionCode))
                        {
                            sqlCommand.Parameters.Add("@P_RegionCode", SqlDbType.VarChar).Value = locaionInfo.RegionCode;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_RegionCode", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.Country))
                        {
                            sqlCommand.Parameters.Add("@P_Country", SqlDbType.VarChar).Value = locaionInfo.Country;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_Country", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.CountryCode))
                        {
                            sqlCommand.Parameters.Add("@P_CountryCode", SqlDbType.VarChar).Value = locaionInfo.CountryCode;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_CountryCode", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.Zipcode))
                        {
                            sqlCommand.Parameters.Add("@P_Zipcode", SqlDbType.VarChar).Value = locaionInfo.Zipcode;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_Zipcode", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.Longitude))
                        {
                            sqlCommand.Parameters.Add("@P_Logintude", SqlDbType.VarChar).Value = locaionInfo.Longitude;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_Logintude", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.Latitude))
                        {
                            sqlCommand.Parameters.Add("@P_Latitude", SqlDbType.VarChar).Value = locaionInfo.Latitude;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_Latitude", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.TimeZone))
                        {
                            sqlCommand.Parameters.Add("@P_TimeZone", SqlDbType.VarChar).Value = locaionInfo.TimeZone;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_TimeZone", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.HostName))
                        {
                            sqlCommand.Parameters.Add("@P_HostName", SqlDbType.VarChar).Value = locaionInfo.HostName;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_HostName", SqlDbType.VarChar).Value = string.Empty;
                        }
                        if (string.IsNullOrWhiteSpace(locaionInfo.IPAddress))
                        {
                            sqlCommand.Parameters.Add("@P_IPAddress", SqlDbType.VarChar).Value = locaionInfo.IPAddress;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add("@P_IPAddress", SqlDbType.VarChar).Value = string.Empty;
                        }

                        sqlCommand.Parameters.Add("@P_StatusDate", SqlDbType.SmallDateTime).Value = DateTime.Now.ToShortDateString();

                        SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                        sqlCommand.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                throw;
            }
        }
    }
}

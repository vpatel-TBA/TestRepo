using System;
using System.Data;
using System.Net.Mail;
using TBA.BeastModels.Application;
using TBA.BeastModels.User;
using TBA.BeastWebService.BAL.Utility;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.BeastWebService.Interfacess.BAL.Utilities;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.BAL.Implementation
{
    public class ShareApplicationAccessLayer : IShareApplicationAccessLayer
    {
        private readonly IShareApplicationDBHandler shareApplicationDBHandler = null;
        private readonly ICacheAdaptor<UserInfo> cacheService = null;
        private readonly ILogService logService = null;
        private readonly IConfigReader configReader = null;
        private readonly ISmsService smsService = null;

        public ShareApplicationAccessLayer(IShareApplicationDBHandler shareApplicationDBHandler, ICacheAdaptor<UserInfo> cacheService, ILogService logService, IConfigReader configReader, ISmsService smsService)
        {
            this.shareApplicationDBHandler = shareApplicationDBHandler;
            this.logService = logService;
            this.cacheService = cacheService;
            this.configReader = configReader;
            this.smsService = smsService;
        }

        public string[] SubmitSharedApplication(UserInfo userInfo, int appId, string recieverEmail, string recieverPhoneNo, string token, string sharedSignalRId, string instanceId)
        {
            logService.Debug("ShareApplicationAccessLayer", "SubmitSharedApplication", OperationCode.NA, DateTime.Now, userInfo.UserID, sharedSignalRId, token, appId, "", "", "", "InstanceId:" + instanceId);

            DateTime defaultStart = DateTime.UtcNow;
            DateTime defaultEnd = DateTime.UtcNow.AddMinutes(configReader.SharedUrlExpirationTime);

            DataTable sharedAppsUrl = new DataTable();
            DataColumn sharedApp = new DataColumn("AutoURLId");
            sharedAppsUrl.Columns.Add(sharedApp);
            sharedApp = new DataColumn("AutoURL");
            sharedAppsUrl.Columns.Add(sharedApp);
            sharedApp = new DataColumn("EmailId");
            sharedAppsUrl.Columns.Add(sharedApp);
            sharedApp = new DataColumn("PhoneNo");
            sharedAppsUrl.Columns.Add(sharedApp);

            DataRow sharedApplicationDetails;

            string[] recieverEmails = null;
            string[] recieverPhoneNos = null;
            string[] autoUrlTokens = null;

            if (recieverEmail != null)
            {
                recieverEmails = recieverEmail.Split('#');
                autoUrlTokens = new string[recieverEmails.Length];
            }
            if (recieverPhoneNo != null)
            {
                recieverPhoneNos = recieverPhoneNo.Split('#');
                if(autoUrlTokens == null)
                {
                    autoUrlTokens = new string[recieverPhoneNos.Length];
                }
                else
                {
                    Array.Resize(ref autoUrlTokens, autoUrlTokens.Length + recieverPhoneNos.Length);
                }
            }

            int countUrl = -1;
            if(recieverEmails != null)
            {
                if (recieverEmails.Length > 0)
                {
                    for (int i = 0; i < recieverEmails.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(recieverEmails[i].Trim()))
                        {
                            string newGuid = Convert.ToString(Guid.NewGuid());
                            //Todo : Confirm expire time of the shared token
                            cacheService.Add(newGuid, new UserInfo() { EmailId = recieverEmails[i].Trim() }, configReader.SharedUrlExpirationTime);
                            sharedApplicationDetails = sharedAppsUrl.NewRow();
                            sharedApplicationDetails["AutoURLId"] = newGuid;
                            sharedApplicationDetails["AutoURL"] = configReader.SharedAppUrl + "?token=" + newGuid;
                            sharedApplicationDetails["EmailId"] = recieverEmails[i].Trim();
                            sharedApplicationDetails["PhoneNo"] = string.Empty;
                            sharedAppsUrl.Rows.Add(sharedApplicationDetails);
                            ++countUrl;
                            autoUrlTokens[countUrl] = newGuid;
                        }
                    }
                }
            }

            DataTable sharedAppsUrlPhone = new DataTable();
            DataColumn sharedAppPhone = new DataColumn("AutoURLId");
            sharedAppsUrlPhone.Columns.Add(sharedAppPhone);
            sharedAppPhone = new DataColumn("AutoURL");
            sharedAppsUrlPhone.Columns.Add(sharedAppPhone);
            sharedAppPhone = new DataColumn("EmailId");
            sharedAppsUrlPhone.Columns.Add(sharedAppPhone);
            sharedAppPhone = new DataColumn("PhoneNo");
            sharedAppsUrlPhone.Columns.Add(sharedAppPhone);

            DataRow sharedApplicationDetailsPhone;

            if (recieverPhoneNos != null)
            {
                if (recieverPhoneNos.Length > 0)
                {
                    for (int i = 0; i < recieverPhoneNos.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(recieverPhoneNos[i].Trim()))
                        {
                            string newGuid = Convert.ToString(Guid.NewGuid());
                            //Todo : Confirm expire time of the shared token
                            cacheService.Add(newGuid, new UserInfo() { PhoneNo = recieverPhoneNos[i].Trim(), EmailId = string.Empty }, configReader.SharedUrlExpirationTime);
                            sharedApplicationDetailsPhone = sharedAppsUrlPhone.NewRow();
                            sharedApplicationDetailsPhone["AutoURLId"] = newGuid;
                            sharedApplicationDetailsPhone["AutoURL"] = configReader.SharedAppUrl + "?token=" + newGuid;
                            sharedApplicationDetailsPhone["EmailId"] = string.Empty;
                            sharedApplicationDetailsPhone["PhoneNo"] = recieverPhoneNos[i].Trim();
                            sharedAppsUrlPhone.Rows.Add(sharedApplicationDetailsPhone);
                            ++countUrl;
                            autoUrlTokens[countUrl] = newGuid;
                        }
                    }
                }
            }

            DataTable emailPhoneInfo = new DataTable();
            emailPhoneInfo = sharedAppsUrl.Copy();
            emailPhoneInfo.Merge(sharedAppsUrlPhone);

            int returnResult = shareApplicationDBHandler.SubmitSharedApplication(userInfo, emailPhoneInfo, defaultStart, defaultEnd, instanceId, appId, sharedSignalRId, recieverEmails, recieverPhoneNos, configReader.SharedUrlExpirationTime, TBAUtility.GetClientIPAddress());
            if (returnResult > 0 && configReader.EnableEmail)
            {
                SendAutoUrlMail(sharedAppsUrl, sharedAppsUrlPhone, userInfo.UserName, Convert.ToString(defaultStart), Convert.ToString(defaultEnd), userInfo.EmailId, userInfo.UserID);
                if (recieverPhoneNos != null)
                {
                    for (var i = 0; i < recieverPhoneNos.Length-1; i++)
                    {
                        var message = "You have received shared calculator URL from " + userInfo.EmailId + " Click on URL to look at it. " + sharedAppsUrlPhone.Rows[i]["AutoURL"];
                        smsService.SendMessage(recieverPhoneNos[i].Trim().ToString(), message);
                    }
                }
            }
            return autoUrlTokens;
        }

        private void SendAutoUrlMail(DataTable sharedAppsUrl, DataTable sharedAppsUrlPhone, string userName, string fromDate, string toDate, string senderEmail, int userId)
        {
            logService.Debug("ShareApplicationAccessLayer", "SendAutoUrlMail", OperationCode.NA, DateTime.Now, userId, "", "", 0, "", "", "", "UserName:" + userName + " FromDate:" + fromDate + " ToDate:" + toDate + " SenderEmail:" + senderEmail + " SharedAppsUrl:" + sharedAppsUrl);

            string mailBody = string.Empty;
            string signature = "Sincerely, <br/>The Beast Apps <br/>info@thebeastapps.com <br/>NY: +1-646-688-7500";
            for (int i = 0; i < sharedAppsUrl.Rows.Count; i++)
            {
                MailMessage mailMessage = new MailMessage();

                mailMessage.To.Add(Convert.ToString(sharedAppsUrl.Rows[i]["EmailId"]));
                mailMessage.From = new MailAddress(configReader.FromMailAddress);

                logService.Info("ShareApplicationAccessLayer", "SendAutoUrlMail", OperationCode.SendAutoUrlMail, DateTime.Now, userId, "", "", 0, "", "", " From : " + senderEmail + " To : " + mailMessage.To.ToString() + " AutoURL:" + sharedAppsUrl.Rows[i]["AutoURL"]);

                mailMessage.Subject = "The BEAST Financial Framework - Shared AutoURL";

                mailBody = "<div style=\"color:navy;font:normal 12px verdana\"><p>Dear User,</p><p>A BEAST Calculator has been shared with you by our customer " + userName + ".</p>" +
                               "<p>You may access <strong>The BEAST Apps</strong> by clicking on the following URL. You may copy and paste this URL in your browser as well.</p>" +
                               "<p><a href=\"[AUTOURL]\">[AUTOURL]</a></p>" +
                               "<p>This URL is valid as follows:</p> " +
                               "<p>User: " + userName + "<br/>" +
                               "URL Valid for: " + Convert.ToDateTime(fromDate).ToString("dd-MMM-yyyy hh:mm:ss tt") + " GMT To " + Convert.ToDateTime(toDate).ToString("dd-MMM-yyyy hh:mm:ss tt") + " GMT</p>" +
                               "<p> <b>NOTE:</b><b><i>&nbsp;Please treat this URL confidential as this URL will give the recipient an access to your account.</i></b></p>" +
                               "<p>If you do not wish to receive these URLs, please let us know.</p>" +
                               "<p>Please contact us if you have any questions.<br/><br/></p>" +
                                signature +
                                "</div>";

                mailMessage.IsBodyHtml = true;
                mailMessage.Body = mailBody.Replace("[AUTOURL]", Convert.ToString(sharedAppsUrl.Rows[i]["AutoURL"])); ;
                MailService.SendAsyncMailLocal(mailMessage);
            }

            /*summary mail to initiator*/

            MailMessage mailMessageSender = new MailMessage();

            mailMessageSender.To.Add(userName);
            mailMessageSender.From = new MailAddress(configReader.FromMailAddress);

            mailMessageSender.Subject = "The BEAST Financial Framework - Calculator Shared";

            if (Convert.ToString(userName) == Convert.ToString(0))
            {
                userName = "User";
            }

            mailBody = "<div style=\"color:navy;font:normal 12px verdana\"><p>Dear " + userName + ",</p>"
                + "<p>You have shared TheBeast calculator to your following " + ((sharedAppsUrl.Rows.Count + sharedAppsUrlPhone.Rows.Count) == 1 ? "contact" : "contacts") + ":</p>"
                + "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"5px\">";

            for (int i = 0; i < sharedAppsUrl.Rows.Count; i++)
            {
                mailBody += "<tr><td>" + sharedAppsUrl.Rows[i]["EmailId"] + "</td><td> - </td><td><a href=\"" + sharedAppsUrl.Rows[i]["AutoURL"] + "\">" + sharedAppsUrl.Rows[i]["AutoURL"] + "</a> " + "</td></tr>";
            }

            for (int i = 0; i < sharedAppsUrlPhone.Rows.Count; i++)
            {
                mailBody += "<tr><td>" + sharedAppsUrlPhone.Rows[i]["PhoneNo"] + "</td><td> - </td><td><a href=\"" + sharedAppsUrlPhone.Rows[i]["AutoURL"] + "\">" + sharedAppsUrlPhone.Rows[i]["AutoURL"] + "</a> " + "</td></tr>";
            }

            mailBody += "</table>"
                        + "<p>URL Valid for: " + Convert.ToDateTime(fromDate).ToString("dd-MMM-yyyy hh:mm:ss tt") + " GMT To " + Convert.ToDateTime(toDate).ToString("dd-MMM-yyyy hh:mm:ss tt") + " GMT</p>"
                        + "<p>Please contact us if you have any questions.</p><br/>"
                        + signature
                        + "</div>";

            mailMessageSender.IsBodyHtml = true;
            mailMessageSender.Body = mailBody;
            MailService.SendAsyncMailLocal(mailMessageSender);
        }

        public SharedApplicationDetails ValidateAndGetSharedAppDetail(string token)
        {
            string ipAddress = TBAUtility.GetClientIPAddress();
            SharedApplicationDetails sharedApplicationDetails = shareApplicationDBHandler.ValidateAndGetSharedAppDetail(token);

            if (!cacheService.ContainsKey(token))
            {
                cacheService.Add(token, new UserInfo() { EmailId = sharedApplicationDetails.EmailId }, configReader.SharedUrlExpirationTime);
                logService.Info("ShareApplicationAccessLayer", "ValidateAndGetSharedAppDetail", OperationCode.NA, DateTime.Now, 0, "", token, 0, "", "", "Token created for EmailId :" + sharedApplicationDetails.EmailId);
            }

            LocationInfo locationInfo = shareApplicationDBHandler.GetIPDetailsFromDB(ipAddress);

            logService.Debug("ShareApplicationAccessLayer", "ValidateAndGetSharedAppDetail", OperationCode.NA, DateTime.Now, 0, sharedApplicationDetails.SharedSignalRId, sharedApplicationDetails.AutoURLId, sharedApplicationDetails.SifId, "", "", "", "EmailId:" + sharedApplicationDetails.EmailId + " SharedAppInfo:" + sharedApplicationDetails + " LocationInfo:" + locationInfo);

            if (locationInfo == null && ipAddress != "::1")
            {
                try
                {
                    locationInfo = TBAUtility.GetInfoFromMaxMind(ipAddress);
                    if (locationInfo != null)
                    {
                        shareApplicationDBHandler.SetIPDetailsInDB(locationInfo);
                    }
                }
                catch
                {
                    locationInfo = null;
                }
            }
            if (configReader.EnableEmail)
            {
                SendShareLoginMail(sharedApplicationDetails, locationInfo);
            }
            return sharedApplicationDetails;
        }

        private void SendShareLoginMail(SharedApplicationDetails sharedApplicationDetails, LocationInfo locationInfo)
        {
            logService.Debug("ShareApplicationAccessLayer", "SendShareLoginMail", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "SharedAppInfo:" + sharedApplicationDetails + " LocationInfo:" + locationInfo);

            bool isValid = false;
            string mailBody = string.Empty;

            MailMessage mailMessageSender = new MailMessage();

            mailMessageSender.To.Add(sharedApplicationDetails.InitiatorEmailId);
            mailMessageSender.From = new MailAddress(configReader.FromMailAddress);
            MailFormatService mailFormat = new MailFormatService();

            if ((sharedApplicationDetails.MessageId == -9 && sharedApplicationDetails.ExtendedStatus == 0) || sharedApplicationDetails.MessageId == 0)
            {
                isValid = true;
            }
            else if (sharedApplicationDetails.MessageId != 0)
            {
                mailMessageSender.Subject = TBAUtility.GetEnumDescription((TBAErrorCode)sharedApplicationDetails.MessageId);
                if (locationInfo != null)
                {
                    mailBody = mailFormat.GetMailBodyForFailMail(sharedApplicationDetails, locationInfo);
                }
                else
                {
                    mailBody = mailFormat.GetMailBodyForFailAccessWithoutLocationDetail(sharedApplicationDetails);
                }
            }

            if (isValid)
            {
                mailMessageSender.Subject = TBAUtility.GetEnumDescription((TBAErrorCode)sharedApplicationDetails.MessageId);
                if (locationInfo != null)
                {
                    mailBody = mailFormat.GetMailBodyForSuccessfulAccess(sharedApplicationDetails, locationInfo);
                }
                else
                {
                    mailBody = mailFormat.GetMailBodyForSuccessfulAccessWithoutLocationDetail(sharedApplicationDetails);
                }
            }
            mailMessageSender.IsBodyHtml = true;
            mailMessageSender.Body = mailBody;
            MailService.SendAsyncMailLocal(mailMessageSender);
        }
    }
}

using System;
using TBA.BeastModels.Application;
using TBA.BeastModels.User;

namespace TBA.BeastWebService.BAL.Utility
{
    public class MailFormatService
    {
        string signature = "Sincerely, <br/>The Beast Apps <br/>info@thebeastapps.com <br/>NY: +1-646-688-7500";
        string userDetail = "";

        public string GetMailBodyForFailMail(SharedApplicationDetails sharedApplicationDetails, LocationInfo locationInfo)
        {
            userDetail = GetContactOrEmail(sharedApplicationDetails);
            // Fail mail body if location is not null
            return "<div style=\"font-size:8pt;color:navy;font-family:Verdana\">Dear " + sharedApplicationDetails.InitiatorName + ",<br/><br/>"
                                    + userDetail + " failed to open the BEAST Calculator shared by you."
                                    + "<table style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">Auto URL:</td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\"> " + sharedApplicationDetails.AutoURL + "</td></tr>"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\" valign=\"top\">Validity:</td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\"> " + Convert.ToDateTime(sharedApplicationDetails.StartDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + " to <br/> " + Convert.ToDateTime(sharedApplicationDetails.EndDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + "  </td></tr>"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">IP Address: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.IPAddress + " </td></tr>"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">Organization: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.Organization + " </td></tr>"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">City: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.City + " </td></tr>"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">Country: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.Country + " </td></tr>"
                                    + "</table>"
                                    + "<br/><br/>" + signature
                                    + "</div>";
        }

        public string GetMailBodyForFailAccessWithoutLocationDetail(SharedApplicationDetails sharedApplicationDetails)
        {
            userDetail = GetContactOrEmail(sharedApplicationDetails);
            // Fail mail body if location is null
            return "<div style=\"font-size:8pt;color:navy;font-family:Verdana\">Dear " + sharedApplicationDetails.InitiatorName + ",<br/><br/>"
                                    + userDetail + " failed to open the BEAST Calculator shared by you."
                                    + "<table style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">Auto URL:</td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\"> " + sharedApplicationDetails.AutoURL + "</td></tr>"
                                    + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\" valign=\"top\">Validity:</td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\"> " + Convert.ToDateTime(sharedApplicationDetails.StartDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + " to <br/> " + Convert.ToDateTime(sharedApplicationDetails.EndDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + "  </td></tr>"
                                    + "</table>"
                                    + "<br/><br/>" + signature
                                    + "</div>";
        }

        public string GetMailBodyForSuccessfulAccess(SharedApplicationDetails sharedApplicationDetails, LocationInfo locationInfo)
        {
            userDetail = GetContactOrEmail(sharedApplicationDetails);
            // Success mail body if location is not null
            return "<div style=\"font-size:8pt;color:navy;font-family:Verdana\">Dear " + sharedApplicationDetails.InitiatorName + ",<br/><br/>"
                           + userDetail + " has opened the BEAST Calculator successfully shared by you.<br/><br/>"
                           + "<table style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">"
                           + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">Auto URL:</td> <td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">&nbsp;<a href =" + sharedApplicationDetails.AutoURL + ">" + sharedApplicationDetails.AutoURL + "</a></td></tr>"
                           + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\" valign=\"top\">Validity:</td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\"> " + Convert.ToDateTime(sharedApplicationDetails.StartDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + " to <br/> " + Convert.ToDateTime(sharedApplicationDetails.EndDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + "  </td></tr>"
                           + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">IP Address: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.IPAddress + " </td></tr>"
                           + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">Organization: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.Organization + " </td></tr>"
                           + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">City: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.City + " </td></tr>"
                           + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">Country: </td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">" + locationInfo.Country + " </td></tr>"
                           + "</table>"
                           + "<br/><br/>" + signature
                           + "</div>";
        }

        public string GetMailBodyForSuccessfulAccessWithoutLocationDetail(SharedApplicationDetails sharedApplicationDetails)
        {
            userDetail = GetContactOrEmail(sharedApplicationDetails);
            // Success mail body if location is null
            return "<div style=\"font-size:8pt;color:navy;font-family:Verdana\">Dear " + sharedApplicationDetails.InitiatorName + ",<br/><br/>"
                            + userDetail + " has opened the BEAST Calculator successfully shared by you.<br/><br/>"
                            + "<table style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\">"
                            + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">Auto URL:</td> <td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\">&nbsp;<a href =" + sharedApplicationDetails.AutoURL + ">" + sharedApplicationDetails.AutoURL + "</a></td></tr>"
                            + "<tr><td width=\"20%\" style=\"FONT-SIZE: 8pt; color:navy;FONT-FAMILY: Verdana;\" valign=\"top\">Validity:</td><td width=\"80%\" style=\"FONT-SIZE: 8pt; FONT-FAMILY: Verdana;\"> " + Convert.ToDateTime(sharedApplicationDetails.StartDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + " to <br/> " + Convert.ToDateTime(sharedApplicationDetails.EndDate).ToString("dd-MMM-yyyy HH:mm:ss tt") + "  </td></tr>"
                            + "</table>"
                            + "<br/><br/>" + signature
                            + "</div>";
        }

        private string GetContactOrEmail(SharedApplicationDetails sharedApplicationDetails)
        {
            if (!string.IsNullOrEmpty(sharedApplicationDetails.EmailId))
            {
                return("Email Address " + sharedApplicationDetails.EmailId);
            }
            else
            {
                return("Contact " + sharedApplicationDetails.PhoneNo);
            }
        }
    }
}

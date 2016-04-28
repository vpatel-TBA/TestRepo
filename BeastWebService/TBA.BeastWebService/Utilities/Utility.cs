using System;

namespace TBA.BeastWebService.Utilities
{
    public class Utility
    {
        public static string ConvertToSMD5(string str)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider md5Prov = new System.Security.Cryptography.MD5CryptoServiceProvider();
            System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
            byte[] md5 = md5Prov.ComputeHash(encoding.GetBytes(str));
            string _result = "";
            for (int i = 0; i < md5.Length; i++)
            {
                _result += ("0" + String.Format("{0:X}", md5[i])).Substring(Convert.ToInt32(md5[i]) <= 15 ? 0 : 1, 2);
            }
            return _result;
        }

        public static string GetClientIPAddress()
        {
            try
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                if (context != null)
                {
                    string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                    if (!string.IsNullOrEmpty(ipAddress))
                    {
                        string[] addresses = ipAddress.Split(',');
                        if (addresses.Length != 0)
                        {
                            //Incase of proxy
                            return addresses[0];
                        }
                    }
                    //When no proxy
                    return context.Request.ServerVariables["REMOTE_ADDR"];
                }
                else
                {
                    //Ip not available
                    return "NotAvailable";
                }
            }
            catch 
            {
                return "NotAvailable";
            }
        }
    }
}
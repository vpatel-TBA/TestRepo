using MaxMind.GeoIP2;
using System;
using TBA.BeastModels.User;

namespace TBA.BeastWebService.BAL.Utility
{
    public class TBAUtility
    {
        public static string GetClientIPAddress()
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
                        return addresses[0];
                    }
                }

                return context.Request.ServerVariables["REMOTE_ADDR"];
            }
            else
            {
                return "";
            }
        }

        public static LocationInfo GetInfoFromMaxMind(string ipAddress)
        {
            int maxMindUserId = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["MaxMindUserId"]);
            string maxMindLicenseKey = Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["MaxMindLicenseKey"]);

            LocationInfo locationInfo = new LocationInfo();

            string url = string.Format("https://geoip.maxmind.com/geoip/v2.1/city/{0}", ipAddress);

            var client = new WebServiceClient(maxMindUserId, maxMindLicenseKey);
            var locationdetails = client.City(ipAddress);

            locationInfo.Organization = locationdetails.Traits.Organization;
            locationInfo.ISP = locationdetails.Traits.Isp;
            locationInfo.City = locationdetails.City.Name;
            locationInfo.Region = locationdetails.MostSpecificSubdivision.Name;
            locationInfo.RegionCode = locationdetails.MostSpecificSubdivision.IsoCode;
            locationInfo.Country = locationdetails.Country.Name;
            locationInfo.CountryCode = locationdetails.Country.IsoCode;
            locationInfo.Zipcode = locationdetails.Postal.Code;
            locationInfo.Longitude = Convert.ToString(locationdetails.Location.Longitude);
            locationInfo.Latitude = Convert.ToString(locationdetails.Location.Latitude);
            locationInfo.TimeZone = locationdetails.Location.TimeZone;
            locationInfo.HostName = locationdetails.Traits.Domain;
            locationInfo.IPAddress = locationdetails.Traits.IPAddress;

            return locationInfo;
        }

        public static string GetEnumDescription(Enum value)
        {
            string enumDescription = string.Empty;
            Type type = value.GetType();
            System.Reflection.MemberInfo[] memInfo = type.GetMember(value.ToString());
            if (memInfo != null && memInfo.Length > 0)
            {
                object[] attrs = memInfo[0].GetCustomAttributes(typeof(System.ComponentModel.DescriptionAttribute), false);
                if (attrs != null && attrs.Length > 0)
                {
                    enumDescription = ((System.ComponentModel.DescriptionAttribute)attrs[0]).Description;
                }
            }
            return enumDescription;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TBA.BeastWebService.Models.User
{
    public class LocationInfo
    {
        public string Organization { get; set; }
        public string ISP { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string RegionCode { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public string Zipcode { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string TimeZone { get; set; }
        public string HostName { get; set; }
        public string IPAddress { get; set; }
        public DateTime StatusDate { get; set; }
        public string StatusInfo { get; set; }
    }
}

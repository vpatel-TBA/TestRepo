using System;
using System.Collections.Generic;
using TBA.BeastWebService.Models.User;
using TBA.CacheService.Interfaces;

namespace TBA.BeastWebService.Models
{
    public class UserInfo : IEntity
    {
        public int UserID { get; set; }

        public string UserName { get; set; }

        public string EmailId { get; set; }

        public DateTime LoginTime { get; set; }

        public List<SignalRConnection> signalRConnectionList { get; set; }
    }
}
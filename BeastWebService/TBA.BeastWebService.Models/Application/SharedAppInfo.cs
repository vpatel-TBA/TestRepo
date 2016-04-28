using System;

namespace TBA.BeastWebService.Models.Application
{
    public class SharedAppInfo
    {
        public string AutoURLId { get; set; }
        public string AutoURL { get; set; }
        public string InitiatorUserId { get; set; }
        public string EmailId { get; set; }
        public string MovetoPage { get; set; }
        public string InstanceId { get; set; }
        public string InstanceInfo { get; set; }
        public bool IsValidFlag { get; set; }
        public int AutoURLUserId { get; set; }
        public int MsgId { get; set; }
        public string Msg { get; set; }
        public string InitiatorEmailId { get; set; }
        public string InitiatorName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

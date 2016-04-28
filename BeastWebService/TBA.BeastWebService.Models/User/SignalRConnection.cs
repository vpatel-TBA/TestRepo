using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TBA.BeastWebService.Models.AppStore;

namespace TBA.BeastWebService.Models.User
{
    public class SignalRConnection
    {
        public string SignalRConnectionId { get; set; }
        public List<Image> ImageList { get; set; }
    }
}

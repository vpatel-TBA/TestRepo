using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TBA.BeastWebService.Models.AppStore
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId{ get; set; }
        public short Type { get; set; }
        public DateTime ImageValidity { get; set; }
        public DateTime ImageCreationTime { get; set; }
        public DateTime ImageCloseTime { get; set; }
        public DateTime LastActivityOn { get; set; }
    }
}

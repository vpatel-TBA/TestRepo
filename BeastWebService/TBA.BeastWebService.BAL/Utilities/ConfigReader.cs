using System;
using System.Configuration;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebService.BAL.Utility
{
    public class ConfigReader : IConfigReader
    {
        private readonly ILogService logService = null;

        public ConfigReader(ILogService logService)
        {
            this.logService = logService;

          
        }

       
    }
}
using System;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfacess.BAL.Utilities;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;
using Twilio;

namespace TBA.BeastWebService.BAL.Utilities
{
    public class TwilioSmsService : ISmsService
    {
        private readonly string senderPhoneNo = null;
        private readonly TwilioRestClient twilioClient = null;
        private readonly ILogService logService = null;

        public TwilioSmsService(IConfigReader configReader, ILogService logService)
        {
            logService.Debug("TwilioSmsService", "TwilioSmsService", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "SenderPhoneNo:" + configReader.SenderPhoneNo + "AccountSid:" + configReader.AccountSid + "AuthToken:" + configReader.AuthToken);
            senderPhoneNo = configReader.SenderPhoneNo;
            twilioClient = new TwilioRestClient(configReader.AccountSid, configReader.AuthToken);
            this.logService = logService;
        }

        public void SendMessage(string receiverPhoneNo, string message)
        {
            logService.Debug("TwilioSmsService", "SendMessage", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "ReceiverPhoneNo:" + receiverPhoneNo + "Message:" + message);
            twilioClient.SendMessage(senderPhoneNo, receiverPhoneNo, message);
        }

    }
}

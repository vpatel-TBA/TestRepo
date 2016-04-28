using System;
using System.Net.Mail;
using TBA.Utilities.MailService;

namespace TBA.BeastWebService.BAL.Utility
{
    public class MailService
    {
        private static readonly MailManager mailManager;

        private MailService() { }

        static MailService()
        {
            mailManager = new MailManager();
        }

        public static void SendMail(MailMessage mailMessage)
        {
            mailManager.SendMail(mailMessage);
        }

        public static void SendAsyncMailLocal(MailMessage mailMessage)
        {
            mailManager.SendAsyncMail(mailMessage, AsyncException);
        }

        public static void AsyncException(Exception exception)
        {
            throw exception;
        }
    }
}


namespace TBA.BeastWebService.Interfacess.BAL.Utilities
{
    public interface ISmsService
    {
        void SendMessage(string receiverPhoneNo, string message);
    }
}

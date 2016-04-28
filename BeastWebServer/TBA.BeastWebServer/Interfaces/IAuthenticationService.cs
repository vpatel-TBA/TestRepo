namespace TBA.BeastWebServer.Interfaces
{
    public interface IAuthenticationService
    {
        bool AuthenticateRequest(string token, string emailId);
    }
}

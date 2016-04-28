using TBA.BeastModels.User;
using TBA.BeastWebServer.Interfaces;

namespace TBA.BeastWebServer.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ICacheAdaptor<UserInfo> cacheService = null;

        public AuthenticationService(ICacheAdaptor<UserInfo> cacheService)
        {
            this.cacheService = cacheService;
        }

        public bool AuthenticateRequest(string token, string emailId)
        {
            if (cacheService.ContainsKey(token))
            {
                string storedEmail = ((UserInfo)cacheService.GetValueByKey(token)).EmailId;
                return storedEmail == emailId ? true : false;
            }
            else
            {
                return false;
            }
        }
    }
}
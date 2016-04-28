using System;
using System.Web.Http;
using System.Web.Http.Controllers;
using TBA.BeastModels.User;
using TBA.BeastWebService.Interfaces.CacheManagers;

namespace TBA.BeastWebService.Attributes
{
    public class TokenAuthorizationAttribute : AuthorizeAttribute
    {
        public ICacheAdaptor<UserInfo> cacheService { get; set; }

        protected override bool IsAuthorized(HttpActionContext context)
        {
            try
            {
                if (context.Request.Headers.Authorization != null)
                {
                    string token = Convert.ToString(context.Request.Headers.Authorization.Parameter);

                    if (cacheService.ContainsKey(token))
                    {
                        return true;
                    }
                    else
                    {
                        context.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                        return false;
                    }
                }
                else
                {
                    context.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                    return false;
                }
            }
            catch
            {
                context.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError);
                return false;
            }
        }
    }
}
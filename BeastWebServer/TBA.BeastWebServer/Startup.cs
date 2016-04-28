using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
[assembly: OwinStartup(typeof(TBA.BeastWebServer.Startup))]

namespace TBA.BeastWebServer
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
           // GlobalHost.DependencyResolver.Register(
           //typeof(AppsDataHub),
           //() => new AppsDataHub(new BeastConnectionManager()));

            HubConfiguration config = new HubConfiguration();
            config.EnableJSONP = true;
            config.EnableDetailedErrors = true;
            app.MapSignalR(config);
        }
    }
}

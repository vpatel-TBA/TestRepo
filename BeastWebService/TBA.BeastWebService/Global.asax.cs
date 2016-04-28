using Autofac;
using Autofac.Integration.WebApi;
using System.Reflection;
using System.Web.Http;
using TBA.BeastWebService.Attributes;
using TBA.BeastWebService.BAL.CacheManagers;
using TBA.BeastWebService.BAL.DependencyBuilder;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.CacheService.Implementations;
using TBA.CacheService.Interfaces;
using TBA.Utilities.LogUtility;

namespace TBA.BeastWebService
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;

            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterWebApiFilterProvider(config);

            builder.RegisterType<LogService>().As<ILogService>().SingleInstance();
            builder.RegisterGeneric(typeof(RedisService<>)).As(typeof(ICacheService<>)).SingleInstance();
            builder.RegisterGeneric(typeof(CacheAdaptor<>)).As(typeof(ICacheAdaptor<>)).SingleInstance();

            builder.RegisterType<TokenAuthorizationAttribute>().PropertiesAutowired();

            builder.RegisterModule(new BalDependencyResolver());

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}

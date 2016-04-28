using Autofac;
using Autofac.Integration.SignalR;
using BeastClientPlugIn;
using Microsoft.AspNet.SignalR;
using System;
using System.Reflection;
using TBA.BeastModels.Interface;
using TBA.BeastModels.Parameters;
using TBA.BeastWebServer.AppModels;
using TBA.BeastWebServer.Authentication;
using TBA.BeastWebServer.CacheManagers;
using TBA.BeastWebServer.ConnectionServices;
using TBA.BeastWebServer.Implementations;
using TBA.BeastWebServer.Interfaces;
using TBA.BeastWebServer.Utilities;
using TBA.CacheService.Implementations;
using TBA.CacheService.Interfaces;
using TBA.Utilities.LogUtility;

namespace TBA.BeastWebServer
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            var containerBuilder = new ContainerBuilder();
            containerBuilder.RegisterHubs(Assembly.GetExecutingAssembly());

            containerBuilder.RegisterType<BeastConnectionManager>().As<IBeastConnectionManager>().SingleInstance(); 
            containerBuilder.RegisterType<ApplicationManager>().As<IApplicationManager>().SingleInstance();
            containerBuilder.RegisterType<ApplicationFactory>().As<IApplicationFactory>().SingleInstance();
            containerBuilder.RegisterType<Application>().As<IApplication>().Keyed<IApplication>("NormalApplication");
            containerBuilder.RegisterType<GridApplication>().As<IApplication>().Keyed<IApplication>("GridApplication");
            containerBuilder.RegisterType<SwaptionApplication>().As<IApplication>().Keyed<IApplication>("SwaptionApplication"); 
            containerBuilder.RegisterType<SignalRResponseAdapter>().As<ISignalRResponseAdapter>().SingleInstance();
            containerBuilder.RegisterGeneric(typeof(RedisService<>)).As(typeof(ICacheService<>)).SingleInstance();
            containerBuilder.RegisterGeneric(typeof(CacheAdaptor<>)).As(typeof(ICacheAdaptor<>)).SingleInstance();
            containerBuilder.RegisterType<ServerAgentClass>().As<ServerAgent>().SingleInstance();
            containerBuilder.RegisterType<AppParameters>().As<IAppParameters>();
            containerBuilder.RegisterType<ResponseParameters>().As<IResponseParameters>();
            containerBuilder.RegisterType<LogService>().As<ILogService>().SingleInstance();
            containerBuilder.RegisterType<ConfigReader>().As<IConfigReader>().SingleInstance();
            containerBuilder.RegisterType<AuthenticationService>().As<IAuthenticationService>().SingleInstance();

            GlobalHost.DependencyResolver = new AutofacDependencyResolver(containerBuilder.Build());
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}
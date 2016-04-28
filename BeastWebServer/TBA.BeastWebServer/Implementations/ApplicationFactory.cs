using Autofac;
using BeastClientPlugIn;
using System;
using TBA.BeastModels.Interface;
using TBA.BeastWebServer.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Info;

namespace TBA.BeastWebServer.Implementations
{
    public class ApplicationFactory : IApplicationFactory
    {
        private readonly IComponentContext componentContext;
        private readonly ILogService logService = null;

        public ApplicationFactory(IComponentContext componentContext, ILogService logService)
        {
            this.componentContext = componentContext;
            this.logService = logService;

            logService.Debug("ApplicationFactory", "ApplicationFactory", OperationCode.NA, DateTime.Now, 0, "", "", 0, "", "", "", "");
        }

        public IApplication GetApplication(IAppParameters appParameters, ServerAgent serverAgent, Action<IAppParameters> removeApplication)
        {
            logService.Debug("ApplicationFactory", "GetApplication", OperationCode.NA, DateTime.Now, appParameters.UserId, appParameters.SignalRConnectionId, appParameters.AuthToken, appParameters.AppId, appParameters.AppName, appParameters.ClientType, appParameters.ClientVersion, "");

            switch (appParameters.AppType)
            {
                case 1:
                    return componentContext.ResolveKeyed<IApplication>("SwaptionApplication", new TypedParameter(typeof(IAppParameters), appParameters), new NamedParameter("serverAgent", serverAgent), new TypedParameter(typeof(Action<IAppParameters>), removeApplication));
                case 2:
                    return componentContext.ResolveKeyed<IApplication>("GridApplication", new TypedParameter(typeof(IAppParameters), appParameters), new NamedParameter("serverAgent", serverAgent), new TypedParameter(typeof(Action<IAppParameters>), removeApplication));
                default:
                    return componentContext.ResolveKeyed<IApplication>("NormalApplication", new TypedParameter(typeof(IAppParameters), appParameters), new NamedParameter("serverAgent", serverAgent), new TypedParameter(typeof(Action<IAppParameters>), removeApplication));
            }

        }
    }
}
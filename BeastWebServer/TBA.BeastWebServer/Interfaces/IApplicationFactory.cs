using BeastClientPlugIn;
using System;
using TBA.BeastModels.Interface;
namespace TBA.BeastWebServer.Interfaces
{
    public interface IApplicationFactory
    {
        IApplication GetApplication(IAppParameters appParameters, ServerAgent serverAgent, Action<IAppParameters> removeApplication);
    }
}

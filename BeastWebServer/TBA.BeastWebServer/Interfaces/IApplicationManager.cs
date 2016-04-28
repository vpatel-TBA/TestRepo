using TBA.BeastModels.Interface;

namespace TBA.BeastWebServer.Interfaces
{
    public interface IApplicationManager
    {
        void OpenApplication(IAppParameters appParameters);
        void CloseApplication(ICloseAppParameters appParameters);
        void RemoveApplication(IAppParameters appParameters);
        void UpdateValueInApplication(IAppParameters appParameters);
    }
}

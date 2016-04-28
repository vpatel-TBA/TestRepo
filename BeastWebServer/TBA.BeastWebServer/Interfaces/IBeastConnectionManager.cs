
namespace TBA.BeastWebServer.Interfaces
{
    public interface IBeastConnectionManager
    {
        bool isServerConnected { get; set; }
        bool isServerForceUnload { get; set; }
        //void OpenApplication(IAppParameters appParameters);
        //void UpdateValueInApplication(IAppParameters appParameters);
        //bool CloseApplication(ICloseAppParameters appParameters);
    }
}

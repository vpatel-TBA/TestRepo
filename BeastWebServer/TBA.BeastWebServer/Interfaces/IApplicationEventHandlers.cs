using BeastClientPlugIn;

namespace TBA.BeastWebServer.Interfaces
{
    public interface IApplicationEventHandlers
    {
        #region Application Events

        void ApplicationAlive();
        void ApplicationStatusChange(DOMDataDocStatus Status, string info);
        void ApplicationStale();
        void ApplicationComplete();
        void ApplicationDataChange(IDOMDataNodeList changedData);

        #endregion
    }
}

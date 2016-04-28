using BeastClientPlugIn;
using TBA.BeastInterface;
using TBA.BeastModels.Interface;

namespace TBA.BeastWebServer.Interfaces
{
    public interface IApplication : IEntity//, IApplicationEventHandlers
    {
        #region Properties

        DOMDataDocument ApplicationDoc
        {
            get;
            set;
        }

        bool IsApplicationAlive
        {
            get;
            set;
        }

        bool IsApplicationStale
        {
            get;
            set;
        }

        int ReferenceCount
        {
            get;
            set;
        }

        IAppParameters AppParameters
        {
            get;
            set;
        }

        #endregion

        void Create(IAppParameters appParameters);
        void GetCachedApplicationData(IAppParameters appParameters);
        void Close();
    }
}

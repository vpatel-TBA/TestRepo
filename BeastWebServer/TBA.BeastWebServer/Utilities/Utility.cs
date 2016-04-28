using TBA.BeastModels.Interface;

namespace TBA.BeastWebServer.Utilities
{
    public static class Utility
    {
        private static string signalRConnectionId = string.Empty;

        public static void SetApplicationKeyForAppParameters(IAppParameters appParameters)
        {
            switch (appParameters.AppMode)
            {
                case 1:
                    //Special image.
                    appParameters.AppKey = appParameters.AppId + "_Special";
                    break;
                case 2:
                    //User specific image.
                    appParameters.AppKey = appParameters.AppId + "_" + appParameters.UserId;
                    break;
                case 3:
                    //Customer specific image.
                    appParameters.AppKey = appParameters.AppId + "_" + appParameters.CustomerId;
                    break;
                default:
                    //Default connection specific image.
                    signalRConnectionId = (string.IsNullOrWhiteSpace(appParameters.SharedSignalRConnectionId)) ? appParameters.SignalRConnectionId : appParameters.SharedSignalRConnectionId;
                    appParameters.AppKey = appParameters.AppId + "_" + signalRConnectionId;
                    break;
            }
        }

        public static void SetApplicationKeyForCloseAppParameters(ICloseAppParameters closeAppParameters)
        {
            switch (closeAppParameters.AppMode)
            {
                case 1:
                    //Special image.
                    closeAppParameters.AppKey = closeAppParameters.AppSifId + "_Special";
                    break;
                case 2:
                    //User specific image.
                    closeAppParameters.AppKey = closeAppParameters.AppSifId + "_" + closeAppParameters.UserId;
                    break;
                case 3:
                    //Customer specific image.
                    closeAppParameters.AppKey = closeAppParameters.AppSifId + "_" + closeAppParameters.CustomerId;
                    break;
                default:
                    //Default connection specific image.
                    signalRConnectionId = (string.IsNullOrWhiteSpace(closeAppParameters.SharedSignalRConnectionId)) ? closeAppParameters.SignalRConnectionId : closeAppParameters.SharedSignalRConnectionId;
                    closeAppParameters.AppKey = closeAppParameters.AppSifId + "_" + signalRConnectionId;
                    break;
            }

        }
    }
}
using System.ComponentModel;

namespace TBA.BeastWebService.BAL.Utility
{
    public enum TBAErrorCode
    {
        [Description("Shared Beast Calc - Successful login")]
        SuccessfullLogin = 0,

        [Description("Shared Beast Calc - Failed to login with the AutoURL as User is either not registered or blocked")]
        UserNotRegisteredOrBlocked = -1,

        [Description("Shared Beast Calc - Failed to login for AutoURL")]
        FailedAutoUrl = -2,

        [Description("Shared Beast Calc - Failed to login with the AutoURL")]
        FailedWithAutoUrl = -3,

        [Description("Shared Beast Calc - Failed to login because of Unauthorized IP Address")]
        UnauthorizedIp = -5,

        [Description("Shared Beast Calc - Failed to login because of no rights for the Session")]
        NoSessionRights = -6,

        [Description("Shared Beast Calc - Failed to login with the AutoURL as URL Expired")]
        UrlExpired = -9,

        [Description("Shared Beast Calc - Failed to login with the AutoURL as the initiator has closed the calculator")]
        CalculatorClosed = -10,
    }
}

namespace TBA.BeastWebService.DAL.Utilities
{
    public interface IConfigReader
    {
        string SessionServerConnectionString { get; }
        string AppStoreConnectionString { get; }
        bool EnableEmail { get; }
        string FromMailAddress { get; }
        string RedisDataExpireInMinute { get; }
        string RedisServer { get; }
        string SharedAppUrl { get; }
        int SharedUrlExpirationTime { get; }
        string AccountSid { get; }
        string AuthToken { get; }
        string SenderPhoneNo { get; }
    }
}

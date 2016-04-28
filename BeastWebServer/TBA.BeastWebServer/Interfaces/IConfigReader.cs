namespace TBA.BeastWebServer.Interfaces
{
    public interface IConfigReader
    {
        string RedisDataExpireInMinute { get; }
        string RedisServer { get; }
        string ServerName1 { get; }
        string ServerName2 { get; }
        string ServerPassword { get; }
        string ServerPort { get; }
        string ServerRetryCount { get; }
        string ServerUserName { get; }
    }
}

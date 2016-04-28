using System;
using TBA.BeastInterface;
namespace TBA.BeastWebServer.Interfaces
{
    public interface ICacheAdaptor<T> where T : IEntity
    {
        bool Add(string key, T value);
        bool Add(string key, T value, double expireTime);
        bool ContainsKey(string key);
        T GetValueByKey(string key);
        bool Remove(string key);
        void SubscribeToChannel(string channelName, Action<string> methodToCallOnMessageReceived);
        void PublishToChannel(string channelName, string message);
    }
}

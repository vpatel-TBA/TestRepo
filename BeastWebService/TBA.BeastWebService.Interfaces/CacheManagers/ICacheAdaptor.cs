using TBA.BeastInterface;
namespace TBA.BeastWebService.Interfaces.CacheManagers
{
    public interface ICacheAdaptor<T> where T : IEntity
    {
        bool Add(string key, T value);
        bool Add(string key, T value, double expireTime);
        bool ContainsKey(string key);
        T GetValueByKey(string key);
        bool Remove(string key);
    }
}

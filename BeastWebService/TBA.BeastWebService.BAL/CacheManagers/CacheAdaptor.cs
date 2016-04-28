using System;
using TBA.BeastInterface;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.CacheService.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;

namespace TBA.BeastWebService.BAL.CacheManagers
{
    public class CacheAdaptor<T> : ICacheAdaptor<T> where T : IEntity
    {
        private readonly ICacheService<T> cacheService = null;
        private readonly ILogService logService = null;

        public CacheAdaptor(ICacheService<T> cacheService, ILogService logService, IConfigReader configReader)
        {
            this.cacheService = cacheService;
            this.cacheService.DefaultExpireTime = Convert.ToDouble(configReader.RedisDataExpireInMinute);
            this.cacheService.HostServer = configReader.RedisServer;
            this.logService = logService;
        }

        public bool Add(string key, T value)
        {
            bool isSuccessful = false;
            try
            {
                isSuccessful = cacheService.Save(typeof(T).Name + "AppStore" + key, value);
            }
            catch (Exception exception)
            {
                logService.Error("TBA.BeastWebService.BAL.CacheManagers.CacheAdaptor", "Add", ExceptionCode.RedisAddFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key:" + key + " Value:" + value, exception);
                throw;
            }
            return isSuccessful;
        }

        public bool Add(string key, T value, double expireTime)
        {
            bool isSuccessful = false;
            try
            {
                isSuccessful = cacheService.Save(typeof(T).Name + "AppStore" + key, value, expireTime);
            }
            catch (Exception exception)
            {
                logService.Error("TBA.BeastWebService.BAL.CacheManagers.CacheAdaptor", "Add", ExceptionCode.RedisAddFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key:" + key + " Value:" + value + " ExpireTime:" + expireTime, exception);
                throw;
            }
            return isSuccessful;
        }

        public T GetValueByKey(string key)
        {
            T dirAuthTokenValue = default(T);
            try
            {
                dirAuthTokenValue = cacheService.GetByKey(typeof(T).Name + "AppStore" + key);
            }
            catch (Exception exception)
            {
                logService.Error("TBA.BeastWebService.BAL.CacheManagers.CacheAdaptor", "GetValueByKey", ExceptionCode.RedisGetValueFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key:" + key, exception);
                throw;
            }
            return dirAuthTokenValue;
        }

        public bool Remove(string key)
        {
            bool isSuccessful = false;
            try
            {
                isSuccessful = cacheService.Remove(typeof(T).Name + "AppStore" + key);
            }
            catch (Exception exception)
            {
                logService.Error("TBA.BeastWebService.BAL.CacheManagers.CacheAdaptor", "Remove", ExceptionCode.RedisRemoveFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key:" + key, exception);
                //Not escalating exception as its not necessary to user.
            }
            return isSuccessful;
        }

        public bool ContainsKey(string key)
        {
            bool isSuccessful = false;
            try
            {
                isSuccessful = cacheService.ContainsKey(typeof(T).Name + "AppStore" + key);
            }
            catch (Exception exception)
            {
                logService.Error("TBA.BeastWebService.BAL.CacheManagers.CacheAdaptor", "ContainsKey", ExceptionCode.RedisContainsKeyFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key:" + key, exception);
                throw;
            }
            return isSuccessful;
        }
    }
}
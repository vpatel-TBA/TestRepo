using System;
using TBA.BeastInterface;
using TBA.BeastWebServer.Interfaces;
using TBA.CacheService.Interfaces;
using TBA.Utilities.LogUtility;
using TBA.Utilities.LogUtility.Error;

namespace TBA.BeastWebServer.CacheManagers
{
    public class CacheAdaptor<T> : ICacheAdaptor<T> where T : IEntity
    {
        private readonly ICacheService<T> cacheService = null;
        private readonly ILogService logService = null;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cacheService"></param>
        /// <param name="prefixKey"></param>
        public CacheAdaptor(ICacheService<T> cacheService, ILogService logService, IConfigReader configReader)
        {
            this.logService = logService;
            this.cacheService = cacheService;
            this.cacheService.DefaultExpireTime = Convert.ToDouble(configReader.RedisDataExpireInMinute);
            this.cacheService.HostServer = configReader.RedisServer;
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
                logService.Error("CacheAdaptor", "Add", ExceptionCode.RedisAddFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key: " + typeof(T).Name + "AppStore" + key + " Value: " + value, exception);
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
                logService.Error("CacheAdaptor", "Add", ExceptionCode.RedisAddFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key: " + key + "Value: " + value, exception);
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
                logService.Error("CacheAdaptor", "GetValueByKey", ExceptionCode.RedisGetValueFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key: " + key, exception);
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
                logService.Error("CacheAdaptor", "Remove", ExceptionCode.RedisRemoveFail, DateTime.Now, 0, "", "", 0, "", "", "", "Key: " + key, exception);
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
                logService.Error("CacheAdaptor", "ContainsKey", ExceptionCode.RedisContainsKeyFail, DateTime.Now, 0, "", "", 0, "", "", "", "", exception);
                throw;
            }
            return isSuccessful;
        }

        public void SubscribeToChannel(string channelName, Action<string> methodToCallOnMessageReceived)
        {
            try
            {
                cacheService.SubscribeToChannel(channelName, methodToCallOnMessageReceived);
            }
            catch (Exception exception)
            {
                logService.Error("CacheAdaptor", "SubscribeToChannel", ExceptionCode.SubscribeToChannelFail, DateTime.Now, 0, "", "", 0, "", "", "", "", exception);
                throw;
            }
        }

        public void PublishToChannel(string channelName, string message)
        {
            try
            {
                cacheService.PublishToChannel(channelName, message);
            }
            catch (Exception exception)
            {
                logService.Error("CacheAdaptor", "PublishToChannel", ExceptionCode.PublishToChannelFail, DateTime.Now, 0, "", "", 0, "", "", "", "", exception);
                throw;
            }
        }
    }
}
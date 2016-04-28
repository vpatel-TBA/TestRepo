using Autofac;
using TBA.BeastWebService.BAL.CacheManagers;
using TBA.BeastWebService.BAL.Implementation;
using TBA.BeastWebService.BAL.Utilities;
using TBA.BeastWebService.DAL.DependencyBuilder;
using TBA.BeastWebService.Interfaces.BAL;
using TBA.BeastWebService.Interfaces.CacheManagers;
using TBA.BeastWebService.Interfacess.BAL.Utilities;
using TBA.CacheService.Implementations;
using TBA.CacheService.Interfaces;

namespace TBA.BeastWebService.BAL.DependencyBuilder
{
    public class BalDependencyResolver : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationAccessLayer>().As<IApplicationAccessLayer>().InstancePerRequest();
            builder.RegisterType<ApplicationCategoryAccessLayer>().As<IApplicationCategoryAccessLayer>().InstancePerRequest();
            builder.RegisterType<ShareApplicationAccessLayer>().As<IShareApplicationAccessLayer>().InstancePerRequest();
            builder.RegisterType<UserAccessLayer>().As<IUserAccessLayer>().InstancePerRequest();
            builder.RegisterType<TwilioSmsService>().As<ISmsService>().InstancePerRequest();

            builder.RegisterGeneric(typeof(RedisService<>)).As(typeof(ICacheService<>)).SingleInstance();
            builder.RegisterGeneric(typeof(CacheAdaptor<>)).As(typeof(ICacheAdaptor<>)).SingleInstance();

            builder.RegisterModule(new DalDependecyResolver());
            base.Load(builder);
        }
    }

}

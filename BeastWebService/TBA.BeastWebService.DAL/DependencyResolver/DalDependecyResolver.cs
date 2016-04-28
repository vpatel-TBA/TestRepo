using Autofac;
using TBA.BeastWebService.DAL.Implementation;
using TBA.BeastWebService.DAL.Utilities;
using TBA.BeastWebService.Interfaces.DAL;
using TBA.Utilities.LogUtility;

namespace TBA.BeastWebService.DAL.DependencyBuilder
{
    public class DalDependecyResolver : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationCategoryDBHandler>().As<IApplicationCategoryDBHandler>().InstancePerRequest();
            builder.RegisterType<ApplicationDBHandler>().As<IApplicationDBHandler>().InstancePerRequest();
            builder.RegisterType<ShareApplicationDBHandler>().As<IShareApplicationDBHandler>().InstancePerRequest();
            builder.RegisterType<UserDBHandler>().As<IUserDBHandler>().InstancePerRequest();

            builder.RegisterType<LogService>().As<ILogService>().SingleInstance();
            builder.RegisterType<ConfigReader>().As<IConfigReader>().SingleInstance();

            base.Load(builder);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StockTracking.Application.Interfaces;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Infrastructure.Context;
using StockTracking.Infrastructure.Repositories;
using StockTracking.Infrastructure.Services;

namespace StockTracking.Infrastructure
{
    public static class ServiceRegistrations
    {
        //Burada Infrastructure katmanına ait servisler eklenir.
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddDbContext<StockTrackingDbContext>(options =>
            {
                options.UseInMemoryDatabase("StockTrackingDb");
            });

            services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
            services.AddScoped(typeof(IRepository<>),typeof(Repository<>));
            return services;
        }
    }
}

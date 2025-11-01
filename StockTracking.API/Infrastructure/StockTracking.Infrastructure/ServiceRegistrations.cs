using Microsoft.Extensions.DependencyInjection;
using StockTracking.Application.Interfaces;
using StockTracking.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Infrastructure
{
    public static class ServiceRegistrations
    {
        //Burada Infrastructure katmanına ait servisler eklenir.
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
            return services;
        }
    }
}

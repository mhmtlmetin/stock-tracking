using Microsoft.Extensions.DependencyInjection;
using StockTracking.Application.Interfaces.Services;
using StockTracking.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IStockService, StockService>();
            return services;
        }
    }
}

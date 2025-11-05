using AutoMapper;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using StockTracking.Application.Interfaces.Services;
using StockTracking.Application.Services;
using System.Reflection;


namespace StockTracking.Application
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IStockService, StockService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IStoreService, StoreService>();

            // AutoMapper konfigurasyonu
            var assembly = Assembly.GetExecutingAssembly();
            var mapperConfig = new MapperConfiguration(mc =>
            {
                // GeneralProfile sınıfınız dahil olmak üzere bu Assembly'deki tüm profilleri bulur.
                mc.AddMaps(assembly);
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            //Fluent Validation servislerini ekliyoruz
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            return services;
        }
    }
}

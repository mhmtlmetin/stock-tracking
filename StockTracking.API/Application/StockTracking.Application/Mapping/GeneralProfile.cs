using AutoMapper;
using StockTracking.Application.DTOs;
using StockTracking.Domain.Entities;

namespace StockTracking.Application.Mapping
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
           
            // POST /products (Request DTO -> Entity)
            CreateMap<CreateProductRequest, Product>();

            // PUT/DELETE /products (Update Request DTO -> Entity)
            CreateMap<UpdateProductRequest, Product>();

            // GET /products (Entity -> Response DTO)
            CreateMap<Product, ProductListResponse>();

            // GET /products/{id} (Entity -> Detail DTO olarak direkt Product Entity'sini kullanabiliriz,
      
            // POST /stores
            CreateMap<CreateStoreRequest, Store>();

            // PUT /stores
            CreateMap<UpdateStoreRequest, Store>();

            // GET /stores
            CreateMap<Store, StoreListResponse>();

            // POST in (Request DTO -> Entity)
            CreateMap<StockInRequest, StockMovement>()
                .ForMember(dest => dest.MovementType, opt => opt.MapFrom(src => "IN"));

            // POST out (Request DTO -> Entity)
            CreateMap<StockOutRequest, StockMovement>()
                .ForMember(dest => dest.MovementType, opt => opt.MapFrom(src => "OUT"));

            // GET Stok Hareketleri (Entity -> Response DTO)
            CreateMap<StockMovement, StockMovementResponse>();
        }
    }
}

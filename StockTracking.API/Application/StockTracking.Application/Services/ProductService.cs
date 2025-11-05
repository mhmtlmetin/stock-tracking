using AutoMapper;
using FluentValidation;
using StockTracking.Application.DTOs;
using StockTracking.Application.Helpers;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Application.Interfaces.Services;
using StockTracking.Domain.Entities;

namespace StockTracking.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateProductRequest> _createProductValidator;

        public ProductService(IUnitOfWork uow,
            IMapper mapper, 
            IValidator<CreateProductRequest> createProductValidator)
        {
            _uow = uow;
            _mapper = mapper;
            _createProductValidator = createProductValidator;
        }

        public async Task<ProductListResponse> AddAsync(CreateProductRequest request, CancellationToken cancellationToken)
        {
           await ValidationTool.ValidateAsync(_createProductValidator, request);

            var product = _mapper.Map<Product>(request);

            await _uow.Products.AddAsync(product);
            await _uow.SaveChangesAsync(cancellationToken);

            return _mapper.Map<ProductListResponse>(product);
        }

        public async Task UpdateAsync(UpdateProductRequest request, CancellationToken cancellationToken)
        {

            var existingProduct = await _uow.Products.GetByIdAsync(request.Id);
            if (existingProduct == null)
            {
                throw new Exception("Güncellenecek ürün bulunamadı."); // Daha sonra Business Exception ile değiştirilmeli
            }

            // Düz DTO mapleme:
            _mapper.Map(request, existingProduct);

            await _uow.Products.UpdateAsync(existingProduct);
            await _uow.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var productToDelete = await _uow.Products.GetByIdAsync(id);
            if (productToDelete == null)
            {
                throw new Exception("Silinecek ürün bulunamadı.");
            }
            await _uow.Products.DeleteAsync(productToDelete);
            await _uow.SaveChangesAsync(cancellationToken);
        }

        public async Task<ProductListResponse> GetByIdAsync(int id)
        {
            var product = await _uow.Products.GetByIdAsync(id);
            if (product == null) return null;
            return _mapper.Map<ProductListResponse>(product);
        }

        public async Task<List<ProductListResponse>> GetListAsync()
        {
            var products = await _uow.Products.GetAllAsync();
            return _mapper.Map<List<ProductListResponse>>(products);
        }
    }
}

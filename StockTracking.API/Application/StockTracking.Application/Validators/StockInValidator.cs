using FluentValidation;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;

namespace StockTracking.Application.Validators
{
    public class StockInValidator : AbstractValidator<StockInRequest>
    {
        private readonly IProductRepository _productRepository;
        private readonly IStoreRepository _storeRepository;

        public StockInValidator(IProductRepository productRepository, IStoreRepository storeRepository)
        {
            _productRepository = productRepository;
            _storeRepository = storeRepository;

            RuleFor(r => r.ProductId)
                .GreaterThan(0).WithMessage("Ürün ID geçerli olmalıdır.")
                // Ürünler var mı ve aktif mi kontrol
                .MustAsync(IsProductExistsAndActive).WithMessage("Belirtilen ürün bulunamadı veya aktif değil.");

            RuleFor(r => r.StoreId)
                .GreaterThan(0).WithMessage("Mağaza ID geçerli olmalıdır.")
                // Mağaza var mı ve aktif mi kontrol
                .MustAsync(IsStoreExistsAndActive).WithMessage("Belirtilen mağaza bulunamadı veya aktif değil.");

            RuleFor(r => r.Quantity)
                .GreaterThan(0).WithMessage("Stok miktarı sıfırdan büyük olmalıdır.");

            RuleFor(r => r.ReferenceNumber)
                .NotEmpty().WithMessage("Referans numarası zorunludur.");
        }

        private async Task<bool> IsProductExistsAndActive(int productId, CancellationToken token)
        {
            var product = await _productRepository.GetByIdAsync(productId);
            return product != null && product.IsActive;
        }

        private async Task<bool> IsStoreExistsAndActive(int storeId, CancellationToken token)
        {
            var store = await _storeRepository.GetByIdAsync(storeId);
            return store != null && store.IsActive;
        }
    }
}

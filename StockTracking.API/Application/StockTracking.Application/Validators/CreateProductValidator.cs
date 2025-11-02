using FluentValidation;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;

namespace StockTracking.Application.Validators
{
    public class CreateProductValidator : AbstractValidator<CreateProductRequest>
    {
        private readonly IProductRepository _productRepository;

        public CreateProductValidator(IProductRepository productRepository)
        {
            _productRepository = productRepository;

            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Ürün adı boş olamaz.")
                .MaximumLength(150).WithMessage("Ürün adı maksimum 150 karakter olmalıdır.");

            RuleFor(p => p.Code)
                .NotEmpty().WithMessage("Ürün kodu boş olamaz.")
                .MaximumLength(50).WithMessage("Ürün kodu maksimum 50 karakter olmalıdır.")
                .MustAsync(IsProductCodeUnique).WithMessage("Bu ürün kodu zaten mevcut.");
            RuleFor(p => p.Description).MaximumLength(500).WithMessage("Açıklama 500 karakterden uzun olamaz.");
        }

        // Kodu veritabanında kontrol eden özel metot
        private async Task<bool> IsProductCodeUnique(string code, CancellationToken cancellationToken)
        {
            var existingProduct = await _productRepository.GetProductByCodeAsync(code);
            return existingProduct == null; // Eğer null ise, benzersizdir.
        }
    }
}

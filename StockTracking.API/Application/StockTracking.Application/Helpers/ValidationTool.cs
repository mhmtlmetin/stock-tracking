using FluentValidation;
using FluentValidation.Results;

namespace StockTracking.Application.Helpers
{
    public static class ValidationTool
    {
        public static async Task ValidateAsync(IValidator validator, object entity)
        {
            // Validasyon sonucunu al
            ValidationResult result = await validator.ValidateAsync(new ValidationContext<object>(entity));

            if (!result.IsValid)
            {
                // Hata varsa
                List<string> errors = result.Errors
                    .Select(e => e.PropertyName + ": " + e.ErrorMessage)
                    .ToList();

                // Şimdilik basit bir Exception kullanıyoruz, daha sonra custom yapabiliriz.
                throw new ValidationException(errors.Aggregate((a, b) => a + ", " + b));
            }
        }
    }
}

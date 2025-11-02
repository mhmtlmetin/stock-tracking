using StockTracking.Domain.Entities;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IStockMovementRepository : IRepository<StockMovement>
    {
        // Tarih ve ürüne göre hareketleri filtreleme için metod
        // IQueryable kullanıldığı için buna gerek kalmayabilir, ancak filtreleme metodu eklenebilir.
    }
}

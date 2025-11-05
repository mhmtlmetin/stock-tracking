using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IProductRepository Products { get; }
        IStoreRepository Stores { get; }
        IStoreStockRepository StoreStocks { get; }
        IStockMovementRepository StockMovements { get; }
        IStockItemRepository StockItems { get; }

        // Kaydedilmemiş tüm değişiklikleri veritabanına uygular.
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}

using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Infrastructure.Context;

namespace StockTracking.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StockTrackingDbContext _context;

        // Entity'ye özel Repository'leri burada tutarız
        public IProductRepository Products { get; }
        public IStoreRepository Stores { get; }
        public IStoreStockRepository StoreStocks { get; }
        public IStockMovementRepository StockMovements { get; }
        public IStockItemRepository StockItems { get; }

        public UnitOfWork(
            StockTrackingDbContext context,
            IProductRepository productRepository,
            IStoreRepository storeRepository,
            IStoreStockRepository storeStockRepository,
            IStockMovementRepository stockMovementRepository,
            IStockItemRepository stockItemRepository)
        {
            _context = context;

            // Dependency Injection ile gelen somut Repository implementasyonlarını atama
            Products = productRepository;
            Stores = storeRepository;
            StoreStocks = storeStockRepository;
            StockMovements = stockMovementRepository;
            StockItems = stockItemRepository;
        }

        // IUnitOfWork arayüzünden gelen SaveChangesAsync metodunun uygulanması
        public async Task<int> SaveChangesAsync()
        {
            // Tüm beklemedeki değişiklikler (Add, Update, Delete) tek bir işlemde kaydedilir.
            return await _context.SaveChangesAsync();
        }

        // Kaynakları temizlemek için burayı IDisposable yaptık.
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}

using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;
using StockTracking.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace StockTracking.Infrastructure.Repositories
{
    public class StockItemRepository : Repository<StockItem>, IStockItemRepository
    {
        public StockItemRepository(StockTrackingDbContext context) : base(context)
        {
        }

        public async Task<List<StockItem>> GetAvailableStockItemsForFifoAsync(int productId, int storeId, decimal requiredQuantity)
        {
            // Bu metod FIFO kuralını uygular:
            // 1. İlgili ürün ve mağazaya ait olmalı.
            // 2. Kalan miktarı (RemainingQuantity) sıfırdan büyük olmalı.
            // 3. Giriş tarihine (EntryDate) göre en eskiden yeniye sıralanmalı.

            return await _dbSet
                .Where(si => si.ProductId == productId && si.StoreId == storeId && si.RemainingQuantity > 0)
                .OrderBy(si => si.EntryDate) // FIFO: En eski giriş önce çıkar
                .ToListAsync();

            // Not: İstenen miktarı (requiredQuantity) karşılayacak kadar kaydı çekmek, 
            // Business Logic katmanında (örneğin bir Service sınıfında) yapılmalıdır. 
            // Repository sadece veriyi doğru sıralanmış/filtrelenmiş şekilde sağlar.
        }
    }
}

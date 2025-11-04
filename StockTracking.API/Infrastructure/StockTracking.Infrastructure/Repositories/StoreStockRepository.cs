using Microsoft.EntityFrameworkCore;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;
using StockTracking.Infrastructure.Context;


namespace StockTracking.Infrastructure.Repositories
{
    public class StoreStockRepository : Repository<StoreStock>, IStoreStockRepository
    {
        public StoreStockRepository(StockTrackingDbContext context) : base(context)
        {
        }
        public async Task<StoreStock> GetByProductAndStoreAsync(int productId, int storeId)
        {
            // Ürün ve mağaza kombinasyonunu kullanarak hızlıca stok kaydını çeker.
            return await _dbSet
                .Include(ss => ss.Product) 
                .Include(ss => ss.Store)   
                .FirstOrDefaultAsync(ss =>
                    ss.ProductId == productId && ss.StoreId == storeId);
        }
        public async Task<List<StoreStock>> GetStocksByProductIdWithStoreAsync(int productId)
        {
            return await _dbSet
                .Include(ss => ss.Store)
                .Where(ss => ss.ProductId == productId && ss.CurrentStock > 0)
                .ToListAsync();
        }
    }
}

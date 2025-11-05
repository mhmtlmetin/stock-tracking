

using Microsoft.EntityFrameworkCore;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;
using StockTracking.Infrastructure.Context;

namespace StockTracking.Infrastructure.Repositories
{
    public class StockMovementRepository : Repository<StockMovement>, IStockMovementRepository
    {
        public StockMovementRepository(StockTrackingDbContext context) : base(context)
        {
        }

        // Tüm stok hareketlerini, ilgili ürün ve mağaza bilgileriyle birlikte tarih sırasına göre getirir.
        public async Task<List<StockMovement>> GetAllMovementsWithDetailsAsync()
        {
            return await _dbSet
                .Include(m => m.Product)
                .Include(m => m.Store)
                .OrderByDescending(m => m.MovementDate) 
                .ToListAsync();
        }

    }
}

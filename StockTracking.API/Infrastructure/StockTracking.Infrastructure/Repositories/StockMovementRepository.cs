

using Microsoft.EntityFrameworkCore;
using StockTracking.Application.DTOs;
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
        public async Task<List<StockMovement>> GetFilteredMovementsWithDetailsAsync(StockMovementQuery query)
        {
            IQueryable<StockMovement> movements = _dbSet
                .Include(m => m.Product)
                .Include(m => m.Store);

            // 1. Ürün ID Filtresi
            if (query.ProductId.HasValue)
            {
                movements = movements.Where(m => m.ProductId == query.ProductId.Value);
            }

            // 2. Başlangıç Tarihi Filtresi
            if (query.StartDate.HasValue)
            {
                movements = movements.Where(m => m.MovementDate >= query.StartDate.Value.Date);
            }

            // 3. Bitiş Tarihi Filtresi
            if (query.EndDate.HasValue)
            {
                movements = movements.Where(m => m.MovementDate <= query.EndDate.Value);
            }

            return await movements
                .OrderByDescending(m => m.MovementDate)
                .ToListAsync();
        }

    }
}

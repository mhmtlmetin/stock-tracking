

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

    }
}

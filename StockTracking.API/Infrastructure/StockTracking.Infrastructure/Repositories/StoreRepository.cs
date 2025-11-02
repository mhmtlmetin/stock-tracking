using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;
using StockTracking.Infrastructure.Context;


namespace StockTracking.Infrastructure.Repositories
{
    public class StoreRepository : Repository<Store>, IStoreRepository
    {
        public StoreRepository(StockTrackingDbContext context) : base(context)
        {
        }

        // IStoreRepository için özel metotlar buraya eklenebilir.
    }
}

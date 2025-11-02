using Microsoft.EntityFrameworkCore;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;
using StockTracking.Infrastructure.Context;


namespace StockTracking.Infrastructure.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(StockTrackingDbContext context) : base(context)
        {
        }

      
        public async Task<Product> GetProductByCodeAsync(string code)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.Code == code);
        }
    }
}

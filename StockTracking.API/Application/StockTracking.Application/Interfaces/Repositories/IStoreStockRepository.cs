using StockTracking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IStoreStockRepository : IRepository<StoreStock>
    {
        // Ürün ve mağaza bazında stoğu hızlıca çekme metodu
        Task<StoreStock> GetByProductAndStoreAsync(int productId, int storeId);
        Task<List<StoreStock>> GetStocksByProductIdWithStoreAsync(int productId);
    }

}

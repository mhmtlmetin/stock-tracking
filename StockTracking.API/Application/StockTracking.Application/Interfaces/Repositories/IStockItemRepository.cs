using StockTracking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IStockItemRepository : IRepository<StockItem>
    {
        // FIFO Business Logic'i için metod
        Task<List<StockItem>> GetAvailableStockItemsForFifoAsync(int productId, int storeId, decimal requiredQuantity);
    }
}

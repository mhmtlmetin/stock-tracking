using StockTracking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        // Product'a özel metodlar buraya gelebilir, örneğin:
        Task<Product> GetProductByCodeAsync(string code);
    }
}

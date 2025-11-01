using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Domain.Entities
{
    public class StoreStock: BaseEntity
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }

        // O depodaki o ürünün anlık toplam miktarı
        public decimal CurrentStock { get; set; }

        // Navigation Properties
        public Product Product { get; set; }
        public Store Store { get; set; }
    }
}

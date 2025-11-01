using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Domain.Entities
{
    public class Product: BaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; } 
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public ICollection<StockMovement> StockMovements { get; set; }
        public ICollection<StoreStock> StoreStocks { get; set; }
        public ICollection<StockItem> StockItems { get; set; } // FIFO için
    }
}

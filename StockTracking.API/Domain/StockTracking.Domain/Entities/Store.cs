using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Domain.Entities
{
    public class Store : BaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; } 
        public string Location { get; set; }
        public bool IsActive { get; set; } = true;

        // NavigaTİON Properties
        public ICollection<StockMovement> StockMovements { get; set; }
        public ICollection<StoreStock> StoreStocks { get; set; }
        public ICollection<StockItem> StockItems { get; set; } // FIFO için
    }
}

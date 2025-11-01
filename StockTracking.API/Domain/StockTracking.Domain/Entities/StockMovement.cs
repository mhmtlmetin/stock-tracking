using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Domain.Entities
{
    public class StockMovement:BaseEntity
    {
        // IN Veya OUT için Enum tercih edilebilir, şimdilik string.
        public string MovementType { get; set; }
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
        public string ReferenceNumber { get; set; }
     
        // Navigation Properties (Foreign Keys)
        public Product Product { get; set; }
        public Store Store { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.DTOs
{
    public class StockMovementResponse
    {
        public long Id { get; set; }
        public string MovementType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; }
        public string ReferenceNumber { get; set; }

        // İlişkili Bilgiler
        public int ProductId { get; set; }
        public string ProductName { get; set; } // JOIN ile gelecek
        public int StoreId { get; set; }
        public string StoreName { get; set; } // JOIN ile gelecek
    }
}

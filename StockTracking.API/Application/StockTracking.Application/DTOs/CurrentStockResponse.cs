using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.DTOs
{
    public class CurrentStockResponse
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public decimal CurrentStock { get; set; }
        public string ProductName { get; set; }
        public string StoreName { get; set; }  
                                                
    }
}

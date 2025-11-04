using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.DTOs
{
    public class ProductStoreStockResponse
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }
        public decimal CurrentStock { get; set; }
        public string StoreCode { get; set; }
    }
}

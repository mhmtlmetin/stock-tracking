
namespace StockTracking.Application.DTOs
{
    public class StockInRequest
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public decimal Quantity { get; set; }
        public string ReferenceNumber { get; set; }
    }
}

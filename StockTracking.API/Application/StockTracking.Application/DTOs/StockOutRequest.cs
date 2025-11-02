
namespace StockTracking.Application.DTOs
{
    public class StockOutRequest
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public decimal Quantity { get; set; }
        public string ReferenceNumber { get; set; }
    }
}

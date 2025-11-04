using StockTracking.Application.DTOs;
using StockTracking.Domain.Entities;

namespace StockTracking.Application.Interfaces.Services
{
    public interface IStockService
    {
        Task<StockMovement> AddStockInAsync(StockInRequest request);
        Task<StockMovement> AddStockOutFifoAsync(StockOutRequest request);
        Task<CurrentStockResponse> GetCurrentStockAsync(int productId, int storeId);
        Task<List<ProductStoreStockResponse>> GetStocksByProductAsync(int productId);

    }
}

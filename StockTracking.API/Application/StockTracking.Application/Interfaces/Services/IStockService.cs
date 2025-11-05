using StockTracking.Application.DTOs;
using StockTracking.Domain.Entities;

namespace StockTracking.Application.Interfaces.Services
{
    public interface IStockService
    {
        Task<StockMovement> AddStockInAsync(StockInRequest request, CancellationToken cancellationToken = default);
        Task<StockMovement> AddStockOutFifoAsync(StockOutRequest request, CancellationToken cancellationToken = default);
        Task<CurrentStockResponse> GetCurrentStockAsync(int productId, int storeId);
        Task<List<ProductStoreStockResponse>> GetStocksByProductAsync(int productId);
        Task<List<StockMovementResponse>> GetAllStockMovementsAsync(StockMovementQuery query);

    }
}

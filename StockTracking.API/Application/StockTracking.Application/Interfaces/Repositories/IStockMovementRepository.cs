using StockTracking.Application.DTOs;
using StockTracking.Domain.Entities;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IStockMovementRepository : IRepository<StockMovement>
    {
        Task<List<StockMovement>> GetFilteredMovementsWithDetailsAsync(StockMovementQuery query);
    }
}

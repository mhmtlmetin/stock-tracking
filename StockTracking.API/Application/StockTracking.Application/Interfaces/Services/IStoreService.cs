using StockTracking.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Services
{
  public interface IStoreService
    {
        // Temel CRUD Metotları
        Task<StoreListResponse> AddAsync(CreateStoreRequest request, CancellationToken cancellationToken);
        Task UpdateAsync(UpdateStoreRequest request, CancellationToken cancellationToken);
        Task DeleteAsync(int id, CancellationToken cancellationToken);

        // Sorgulama Metotları
        Task<StoreListResponse> GetByIdAsync(int id);
        Task<List<StoreListResponse>> GetListAsync();
    }
}

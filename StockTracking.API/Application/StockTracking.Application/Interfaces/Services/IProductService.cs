using StockTracking.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Services
{
    public interface IProductService
    {
        // Temel CRUD Metotları
        Task<ProductListResponse> AddAsync(CreateProductRequest request, CancellationToken cancellationToken);
        Task UpdateAsync(UpdateProductRequest request, CancellationToken cancellationToken);
        Task DeleteAsync(int id, CancellationToken cancellationToken);

        // Sorgulama Metotları
        Task<ProductListResponse> GetByIdAsync(int id);
        Task<List<ProductListResponse>> GetListAsync();
    }
}

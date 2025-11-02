using StockTracking.Application.DTOs;
using StockTracking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Services
{
    public interface IStockService
    {
        Task<StockMovement> AddStockInAsync(StockInRequest request);
        Task<StockMovement> AddStockOutFifoAsync(StockOutRequest request);
     
    }
}

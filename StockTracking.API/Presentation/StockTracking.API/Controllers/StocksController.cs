using Microsoft.AspNetCore.Mvc;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Services;

namespace StockTracking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StocksController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StocksController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpPost("in")]
        public async Task<IActionResult> StockIn([FromBody] StockInRequest request)
        {
         
            var movement = await _stockService.AddStockInAsync(request);
            return StatusCode(201, new { MovementId = movement.Id, Message = "Stok girişi başarıyla tamamlandı." });
        }

        
        [HttpPost("out")]
        public async Task<IActionResult> StockOut([FromBody] StockOutRequest request)
        {
            try
            {
                var movement = await _stockService.AddStockOutFifoAsync(request);

                return Ok(new { MovementId = movement.Id, Message = "Stok çıkışı (FIFO) başarıyla tamamlandı." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

   
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentStock(int productId, int storeId)
        {
            var stock = await _stockService.GetCurrentStockAsync(productId, storeId);

            if (stock == null)
            {
                return Ok(new { ProductId = productId, StoreId = storeId, CurrentStock = 0, Message = "Stok kaydı bulunamadı. Anlık stok sıfırdır." });
            }

            return Ok(stock);
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Application.Interfaces.Services;
using StockTracking.Domain.Entities;

namespace StockTracking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {

        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

       
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateProductRequest request, CancellationToken cancellationToken = default)
        {
            var response = await _productService.AddAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _productService.GetByIdAsync(id);
            if (response == null) return NotFound("Ürün bulunamadı.");
            return Ok(response);
        }

       
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var response = await _productService.GetListAsync();
            return Ok(response);
        }

      
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _productService.UpdateAsync(request, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            try
            {
                await _productService.DeleteAsync(id, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}

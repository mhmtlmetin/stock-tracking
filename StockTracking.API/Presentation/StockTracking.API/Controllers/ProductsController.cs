using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace StockTracking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly IUnitOfWork _uow; 
        private readonly IMapper _mapper;

        public ProductsController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

       
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateProductRequest request)
        {
            var product = _mapper.Map<Product>(request);

            await _uow.Products.AddAsync(product);
            await _uow.SaveChangesAsync();

            var response = _mapper.Map<ProductListResponse>(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, response);
        }

       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _uow.Products.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            var response = _mapper.Map<ProductListResponse>(product);
            return Ok(response);
        }

       
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var products = await _uow.Products.GetAll().ToListAsync();
            var response = _mapper.Map<List<ProductListResponse>>(products);
            return Ok(response);
        }

      
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductRequest request)
        {
            var existingProduct = await _uow.Products.GetByIdAsync(request.Id);
            if (existingProduct == null) return NotFound("Güncellenecek ürün bulunamadı.");

            _mapper.Map(request, existingProduct);

            await _uow.Products.UpdateAsync(existingProduct);
            await _uow.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var productToDelete = await _uow.Products.GetByIdAsync(id);

            if (productToDelete == null)
            {
                return NotFound("Silinecek ürün bulunamadı.");
            }

            await _uow.Products.DeleteAsync(productToDelete);
            await _uow.SaveChangesAsync();

            return NoContent();
        }
    }
}

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
    public class StoresController : ControllerBase
    {

        private readonly IStoreService _storeService;
        public StoresController(IStoreService storeService)
        {
            _storeService = storeService;
        }

    
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateStoreRequest request, CancellationToken cancellationToken = default)
        {
            var response = await _storeService.AddAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _storeService.GetByIdAsync(id);
            if (response == null)
            {
                return NotFound("Mağaza bulunamadı.");
            }
            return Ok(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var response = await _storeService.GetListAsync();
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateStoreRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _storeService.UpdateAsync(request, cancellationToken);
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
                await _storeService.DeleteAsync(id, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}

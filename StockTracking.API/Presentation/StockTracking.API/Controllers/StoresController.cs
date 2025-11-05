using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Domain.Entities;

namespace StockTracking.API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public StoresController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

    
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateStoreRequest request, CancellationToken cancellationToken = default)
        {
            var store = _mapper.Map<Store>(request);

            await _uow.Stores.AddAsync(store);
            await _uow.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<StoreListResponse>(store); 
            return CreatedAtAction(nameof(GetById), new { id = store.Id }, response);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var store = await _uow.Stores.GetByIdAsync(id);
            if (store == null)
            {
                return NotFound("Mağaza bulunamadı.");
            }

            var response = _mapper.Map<StoreListResponse>(store);
            return Ok(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var stores = await _uow.Stores.GetAll().ToListAsync();
            var response = _mapper.Map<List<StoreListResponse>>(stores);
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateStoreRequest request, CancellationToken cancellationToken)
        {
            var existingStore = await _uow.Stores.GetByIdAsync(request.Id);
            if (existingStore == null) return NotFound("Güncellenecek mağaza bulunamadı.");

            _mapper.Map(request, existingStore);

            await _uow.Stores.UpdateAsync(existingStore);
            await _uow.SaveChangesAsync(cancellationToken);

            return NoContent();
        }

      
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var storeToDelete = await _uow.Stores.GetByIdAsync(id);
            if (storeToDelete == null) return NotFound("Silinecek mağaza bulunamadı.");

            await _uow.Stores.DeleteAsync(storeToDelete);
            await _uow.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}

using AutoMapper;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Application.Interfaces.Services;
using StockTracking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Services
{
    public class StoreService : IStoreService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public StoreService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<StoreListResponse> AddAsync(CreateStoreRequest request, CancellationToken cancellationToken)
        {
            var store = _mapper.Map<Store>(request);
            await _uow.Stores.AddAsync(store);
            await _uow.SaveChangesAsync(cancellationToken);

            return _mapper.Map<StoreListResponse>(store);
        }

        public async Task UpdateAsync(UpdateStoreRequest request, CancellationToken cancellationToken)
        {
            var existingStore = await _uow.Stores.GetByIdAsync(request.Id);
            if (existingStore == null)
            {
                throw new Exception("Güncellenecek mağaza bulunamadı.");
            }

            _mapper.Map(request, existingStore);

            await _uow.Stores.UpdateAsync(existingStore);
            await _uow.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var storeToDelete = await _uow.Stores.GetByIdAsync(id);
            if (storeToDelete == null)
            {
                throw new Exception("Silinecek mağaza bulunamadı.");
            }
            await _uow.Stores.DeleteAsync(storeToDelete);
            await _uow.SaveChangesAsync(cancellationToken);
        }

        public async Task<StoreListResponse> GetByIdAsync(int id)
        {
            var store = await _uow.Stores.GetByIdAsync(id);
            if (store == null) return null;
            return _mapper.Map<StoreListResponse>(store);
        }

        public async Task<List<StoreListResponse>> GetListAsync()
        {
            var stores = await _uow.Stores.GetAllAsync();
            return _mapper.Map<List<StoreListResponse>>(stores);
        }
    }
}

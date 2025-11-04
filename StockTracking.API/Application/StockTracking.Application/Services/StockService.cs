using AutoMapper;
using StockTracking.Application.DTOs;
using StockTracking.Application.Interfaces.Repositories;
using StockTracking.Application.Interfaces.Services;
using StockTracking.Domain.Entities;
namespace StockTracking.Application.Services
{
    public class StockService : IStockService
    {
        private readonly IUnitOfWork _uow;

        private readonly IMapper _mapper;

        public StockService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

       
        // 1. POST IN: Depoya Stok Girişi
    
        public async Task<StockMovement> AddStockInAsync(StockInRequest request)
        {
            // 1. Gerekli Kontroller (FluentValidation burada çalışmış olmalı)

            // 2. Yeni Stok Hareketi (StockMovement) kaydı oluştur
            var movement = _mapper.Map<StockMovement>(request);

            await _uow.StockMovements.AddAsync(movement);

            // 3. FIFO Takibi için Stok Kalemi (StockItem) oluştur (Entry Date önemli!)
            var stockItem = new StockItem
            {
                ProductId = request.ProductId,
                StoreId = request.StoreId,
                EntryDate = movement.MovementDate,
                InitialQuantity = request.Quantity,
                RemainingQuantity = request.Quantity, // Kalan miktar başta giriş miktarına eşittir.
                MovementInId = movement.Id // Bu hareketi referans al
            };

            await _uow.StockItems.AddAsync(stockItem);

            // 4. Mağaza Stok Özetini (StoreStock) Güncelle (Write Load)
            var storeStock = await _uow.StoreStocks.GetByProductAndStoreAsync(request.ProductId, request.StoreId);

            if (storeStock == null)
            {
                storeStock = new StoreStock
                {
                    ProductId = request.ProductId,
                    StoreId = request.StoreId,
                    CurrentStock = 0 // Sıfırla başlat
                };
                await _uow.StoreStocks.AddAsync(storeStock);
            }

            storeStock.CurrentStock += request.Quantity;
            storeStock.UpdatedDate = DateTime.UtcNow;

            // 5. Değişiklikleri Tek Bir Transaction içinde kaydet
            await _uow.SaveChangesAsync(); // StockMovement, StockItem ve StoreStock tek seferde kaydedilir.

            return movement;
        }

      
        // 2. POST OUT: Depodan Stok Çıkışı (FIFO)
        
        public async Task<StockMovement> AddStockOutFifoAsync(StockOutRequest request)
        {
            // 1. Stok Yeterliliği Kontrolü
            var currentSummary = await _uow.StoreStocks.GetByProductAndStoreAsync(request.ProductId, request.StoreId);
            if (currentSummary == null || currentSummary.CurrentStock < request.Quantity)
            {
                // Custom Exception fırlatılmalı
                throw new Exception("Yeterli stok yok!");
            }

            decimal quantityToOut = request.Quantity;

            // 2. FIFO'ya Uygun Stok Kalemlerini Çek
            // En eski girişten (EntryDate ASC) başlayarak kalan miktarı > 0 olanları çekeriz.
            var availableStockItems = await _uow.StockItems.GetAvailableStockItemsForFifoAsync(
                request.ProductId,
                request.StoreId,
                quantityToOut // Bu aslında sadece filtreleme için bilgi taşır
            );

            if (availableStockItems.Sum(si => si.RemainingQuantity) < quantityToOut)
            {
                // Normalde bu kontrol yukarıda yapıldığı için buraya düşmemeli, ama güvenlik için durabilir.
                throw new Exception("FIFO kalemlerinde yetersiz stok. Veri bütünlüğü hatası.");
            }

            // 3. Stok Kalemlerinden Düşme (FIFO Mantığı)
            foreach (var stockItem in availableStockItems)
            {
                if (quantityToOut <= 0) break; // İstenen miktar karşılandı

                if (stockItem.RemainingQuantity >= quantityToOut)
                {
                    // İstenen miktar bu kalemden karşılanıyor.
                    stockItem.RemainingQuantity -= quantityToOut;
                    quantityToOut = 0;
                }
                else
                {
                    // Bu kalem tamamen tüketiliyor.
                    quantityToOut -= stockItem.RemainingQuantity;
                    stockItem.RemainingQuantity = 0;
                }
                // StockItem otomatik olarak UpdateAsync ile izleniyor.
            }

            // 4. Yeni Stok Hareketi (StockMovement) kaydı oluştur
            var movement = new StockMovement
            {
                ProductId = request.ProductId,
                StoreId = request.StoreId,
                Quantity = request.Quantity,
                MovementType = "OUT",
                ReferenceNumber = request.ReferenceNumber,
                MovementDate = DateTime.UtcNow
            };
            await _uow.StockMovements.AddAsync(movement);

            // 5. Mağaza Stok Özetini (StoreStock) Güncelle
            currentSummary.CurrentStock -= request.Quantity;
            currentSummary.UpdatedDate = DateTime.UtcNow;
            _uow.StoreStocks.UpdateAsync(currentSummary);

         
            // StockItem'ların güncellenmesi, yeni StockMovement ve StoreStock güncellemesi tek Transaction'da yapıldı
            await _uow.SaveChangesAsync();

            return movement;
        }

        public async Task<CurrentStockResponse> GetCurrentStockAsync(int productId, int storeId)
        {
            // StoreStock tablosu zaten anlık stoku tuttuğu için hızlıca sorgulayabiliriz.
            var currentStock = await _uow.StoreStocks.GetByProductAndStoreAsync(productId, storeId);
            if (currentStock == null) return null; 
            return _mapper.Map<CurrentStockResponse>(currentStock);
        }
    }
}

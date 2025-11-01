using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Domain.Entities
{
    public class StockItem:BaseEntity
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }

        // FIFO Sıralaması için anahtar
        public DateTime EntryDate { get; set; }

        // Girişteki ilk miktar
        public decimal InitialQuantity { get; set; }

        // Kalan miktar (Çıkışta buradan düşülecek)
        public decimal RemainingQuantity { get; set; }

        // Bu stoğu oluşturan giriş hareketinin Id'si
        public long MovementInId { get; set; }

        // Navigation Properties
        public Product Product { get; set; }
        public Store Store  { get; set; }
    }
}

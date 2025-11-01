using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockTracking.Domain.Entities;

public class StoreStockConfiguration : IEntityTypeConfiguration<StoreStock>
{
    public void Configure(EntityTypeBuilder<StoreStock> builder)
    {
        builder.HasKey(ss => ss.Id);

        // ProductId ve StoreId kombinasyonu benzersiz olmalı
        builder.HasIndex(ss => new { ss.ProductId, ss.StoreId }).IsUnique();

        // İlişkiler
        builder.HasOne(ss => ss.Product)
               .WithMany(p => p.StoreStocks) // Product içindeki koleksiyon adı da değişmeli
               .HasForeignKey(ss => ss.ProductId);

        builder.HasOne(ss => ss.Store)
               .WithMany(s => s.StoreStocks) // Store içindeki koleksiyon adı da değişmeli
               .HasForeignKey(ss => ss.StoreId);
    }
}
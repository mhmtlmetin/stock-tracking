using Microsoft.EntityFrameworkCore;
using StockTracking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Infrastructure.Context
{
    public class StockTrackingDbContext:DbContext
    {
        public StockTrackingDbContext(DbContextOptions<StockTrackingDbContext> options)
        : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<StoreStock> StoreStocks { get; set; }
        public DbSet<StockItem> StockItems { get; set; } // FIFO için

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            //Burada CreatedDate ve UpdatedDate otomatik set ediliyor.
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                ((BaseEntity)entityEntry.Entity).UpdatedDate = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseEntity)entityEntry.Entity).CreatedDate = DateTime.UtcNow;
                }
            }

            return base.SaveChanges();
        }
    }
}

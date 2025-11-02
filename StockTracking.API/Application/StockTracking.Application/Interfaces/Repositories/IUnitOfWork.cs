using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        // Kaydedilmemiş tüm değişiklikleri veritabanına uygular.
        Task<int> SaveChangesAsync();

        // Transaction başlatma (özellikle karmaşık iş akışları için)
        
    }
}

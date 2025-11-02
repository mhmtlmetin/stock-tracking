using StockTracking.Domain.Entities;

namespace StockTracking.Application.Interfaces.Repositories
{
    public interface IRepository<T> where T : BaseEntity
    {
        // Okuma İşlemleri
        Task<T> GetByIdAsync(int id);
        IQueryable<T> GetAll(); // Linq sorgusu oluşturmak için IQueryable döndürülür.
                                // Task<List<T>> GetAllAsync(); // Eğer direk listeye ihtiyacınız varsa

        // Yazma İşlemleri
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<T> DeleteAsync(T entity);
    }
}

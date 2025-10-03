using CicekciBackend.Application.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CicekciBackend.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
using CicekciBackend.Application.Interfaces;
using CicekciBackend.Application.Models;
using CicekciBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CicekciBackend.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        // DÜZELTİLMİŞ METOD: Sadece aktif ürünleri getir
        public async Task<IEnumerable<Product>> GetAllAsync() =>
            await _context.Products
                .Where(p => p.IsActive) // Sadece aktif ürünler
                .AsNoTracking()
                .ToListAsync();

        public async Task<Product> GetByIdAsync(int id) =>
            await _context.Products
                .Where(p => p.Id == id && p.IsActive)
                .FirstOrDefaultAsync();

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
    }
}
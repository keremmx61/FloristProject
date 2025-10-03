using CicekciBackend.Application.Interfaces;
using CicekciBackend.Application.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CicekciBackend.Application.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;
        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            await _productRepository.AddAsync(product);
            return product;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync() =>
            await _productRepository.GetAllAsync();

        public async Task<Product> GetProductByIdAsync(int id) =>
            await _productRepository.GetByIdAsync(id);

        public async Task UpdateProductAsync(Product product) =>
            await _productRepository.UpdateAsync(product);

        public async Task DeleteProductAsync(int id) =>
            await _productRepository.DeleteAsync(id);
    }
}
using OPGSavi.Models;
using OPGSavi.Repositories;

namespace OPGSavi.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Products>> GetAllProductsAsync(string? search = null, string sortDirection = "asc", int page = 1, int pageSize = 3)
        {
            return _repository.GetAllProductsAsync(search, sortDirection, page, pageSize);
        }

        public Task<Products?> GetProductByIdAsync(int id)
        {
            return _repository.GetByIdAsync(id);
        }

        public Task<int> CreateProductAsync(Products product)
        {
            return _repository.CreateAsync(product);
        }

        public Task<int> UpdateProductAsync(Products product)
        {
            return _repository.UpdateAsync(product);
        }

        public Task<int> DeleteProductAsync(int id)
        {
            return _repository.DeleteAsync(id);
        }
    }
}
using OPGSavi.Models;

namespace OPGSavi.Services
{
    public interface IProductService
    {
        Task<List<Products>> GetAllProductsAsync(string? search = null, string sortDirection = "asc", int page = 1, int pageSize = 10);

        Task<Products?> GetProductByIdAsync(int id);

        Task<int> CreateProductAsync(Products product);

        Task<int> UpdateProductAsync(Products product);

        Task<int> DeleteProductAsync(int id);
    }
}
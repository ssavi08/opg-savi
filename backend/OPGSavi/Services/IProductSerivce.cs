using OPGSavi.Models;

namespace OPGSavi.Services
{
    public interface IProductService
    {
        Task<List<Products>> GetAllProductsAsync();
        Task<Products?> GetProductByIdAsync(int id);
        Task<int> CreateProductAsync(Products product);
        Task<int> UpdateProductAsync(Products product);
        Task<int> DeleteProductAsync(int id);
    }
}


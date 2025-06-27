using OPGSavi.Models;

namespace OPGSavi.Repositories
{
    public interface IProductRepository
    {
        Task<List<Products>> GetAllProductsAsync(string? search = null, string sortDirection = "asc", int page = 1, int pageSize = 10);

        Task<Products?> GetByIdAsync(int id);

        Task<int> CreateAsync(Products product);

        Task<int> UpdateAsync(Products product);

        Task<int> DeleteAsync(int id);
    }
}
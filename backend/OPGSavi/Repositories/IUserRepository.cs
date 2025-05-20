using OPGSavi.Models;

namespace OPGSavi.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<List<User>> GetAllAsync();
        Task<int> CreateAsync(User user);
        Task<int> DeleteAsync(int id);

    }
}

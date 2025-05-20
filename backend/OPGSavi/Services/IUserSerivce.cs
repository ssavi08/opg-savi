using OPGSavi.Models;

namespace OPGSavi.Services
{
    public interface IUserService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<List<User>> GetAllUsersAsync();
        Task<User?> GetByIdAsync(int id);
        Task<int> DeleteUserAsync(int id);
    }
}

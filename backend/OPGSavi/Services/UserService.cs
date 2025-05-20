using OPGSavi.Models;
using OPGSavi.Repositories;
using OPGSavi.Utilities;

namespace OPGSavi.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtHelper _jwtHelper;

        public UserService(IUserRepository userRepository, IJwtHelper jwtHelper)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            var existing = await _userRepository.GetByEmailAsync(request.Email);
            if (existing != null)
                return null;

            var hashedPassword = PasswordHasher.Hash(request.Password);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashedPassword,
                RoleId = 2
            };

            await _userRepository.CreateAsync(user);

            return new AuthResponse
            {
                Username = user.Username,
                Role = "user",
                Token = _jwtHelper.GenerateToken(user)
            };
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
                return null;

            return new AuthResponse
            {
                Username = user.Username,
                Role = user.RoleId == 1 ? "admin" : "user",
                Token = _jwtHelper.GenerateToken(user)
            };
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public Task<int> DeleteUserAsync(int id)
        {
            return _userRepository.DeleteAsync(id);
        }

    }
}

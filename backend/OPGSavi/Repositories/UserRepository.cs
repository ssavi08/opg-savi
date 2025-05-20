using System.Text;
using Npgsql;
using OPGSavi.Data;
using OPGSavi.Models;

namespace OPGSavi.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public UserRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var sql = new StringBuilder("SELECT id, username, email, password_hash, role_id, created_at FROM users WHERE email = @Email;");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("Email", email);

            await using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    PasswordHash = reader.GetString(3),
                    RoleId = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5)
                };
            }

            return null;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            var sql = new StringBuilder("SELECT id, username, email, password_hash, role_id, created_at FROM users WHERE id = @Id;");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("Id", id);

            await using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    PasswordHash = reader.GetString(3),
                    RoleId = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5)
                };
            }

            return null;
        }

        public async Task<List<User>> GetAllAsync()
        {
            var users = new List<User>();
            var sql = new StringBuilder("SELECT id, username, email, password_hash, role_id, created_at FROM users;");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                users.Add(new User
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    PasswordHash = reader.GetString(3),
                    RoleId = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5)
                });
            }

            return users;
        }

        public async Task<int> CreateAsync(User user)
        {
            var sql = new StringBuilder(@"
                INSERT INTO users (username, email, password_hash, role_id)
                VALUES (@Username, @Email, @PasswordHash, @RoleId);
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("Username", user.Username);
            command.Parameters.AddWithValue("Email", user.Email);
            command.Parameters.AddWithValue("PasswordHash", user.PasswordHash);
            command.Parameters.AddWithValue("RoleId", user.RoleId);

            return await command.ExecuteNonQueryAsync();
        }

        public async Task<int> DeleteAsync(int id)
        {
            var sql = new StringBuilder("DELETE FROM users WHERE id = @id;");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("id", id);

            return await command.ExecuteNonQueryAsync();
        }

    }
}

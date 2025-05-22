using System.Text;
using Npgsql;
using OPGSavi.Models;
using OPGSavi.Data;

namespace OPGSavi.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public OrderRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<Order?> GetOpenOrderForUserAsync(int userId)
        {
            var sql = new StringBuilder(@"
                SELECT id, user_id, total, created_at, status
                FROM orders
                WHERE user_id = @userId AND status = 'open'
                ORDER BY created_at DESC
                LIMIT 1;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("userId", userId);

            await using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Order
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    Total = reader.GetDecimal(2),
                    CreatedAt = reader.GetDateTime(3),
                    Status = reader.GetString(4)
                };
            }

            return null;
        }

        public async Task<int> CreateOrderAsync(Order order)
        {
            var sql = new StringBuilder(@"
                INSERT INTO orders (user_id, total, status)
                VALUES (@userId, @total, @status)
                RETURNING id;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("userId", order.UserId);
            command.Parameters.AddWithValue("total", order.Total);
            command.Parameters.AddWithValue("status", order.Status); // dynamically set

            return (int)await command.ExecuteScalarAsync();
        }

        public async Task<List<Order>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = new List<Order>();
            var sql = new StringBuilder(@"
                SELECT id, user_id, total, created_at, status
                FROM orders
                WHERE user_id = @userId
                ORDER BY created_at DESC;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("userId", userId);

            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orders.Add(new Order
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    Total = reader.GetDecimal(2),
                    CreatedAt = reader.GetDateTime(3),
                    Status = reader.GetString(4)
                });
            }

            return orders;
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            var sql = new StringBuilder(@"
        SELECT id, user_id, total, created_at, status
        FROM orders
        WHERE id = @orderId;
    ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("orderId", orderId);

            await using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Order
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    Total = reader.GetDecimal(2),
                    CreatedAt = reader.GetDateTime(3),
                    Status = reader.GetString(4)
                };
            }

            return null;
        }


        public async Task<int> ConfirmOrderAsync(int orderId)
        {
            var sql = new StringBuilder(@"
                UPDATE orders
                SET total = (
                    SELECT COALESCE(SUM(quantity * price), 0)
                    FROM order_items
                    WHERE order_id = @id
                ),
                status = 'confirmed'
                WHERE id = @id;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("id", orderId);

            return await command.ExecuteNonQueryAsync();
        }


        public async Task<List<AdminOrderView>> GetAllOrdersWithUsersAsync()
        {
            var sql = new StringBuilder(@"
                SELECT o.id, u.username, u.email, o.total, o.status, o.created_at
                FROM orders o
                JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC;
            ");

            var results = new List<AdminOrderView>();

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (reader.Read())
            {
                results.Add(new AdminOrderView
                {
                    OrderId = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    Total = reader.GetDecimal(3),
                    Status = reader.GetString(4),
                    CreatedAt = reader.GetDateTime(5)
                });
            }

            return results;
        }
    }
}

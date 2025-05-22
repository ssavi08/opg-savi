using System.Text;
using Npgsql;
using OPGSavi.Models;
using OPGSavi.Data;

namespace OPGSavi.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public OrderItemRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<List<OrderItem>> GetItemsByOrderIdAsync(int orderId)
        {
            var items = new List<OrderItem>();
            var sql = new StringBuilder(@"
                SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name, oi.quantity, oi.price
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = @orderId;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("orderId", orderId);

            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                items.Add(new OrderItem
                {
                    Id = reader.GetInt32(0),
                    OrderId = reader.GetInt32(1),
                    ProductId = reader.GetInt32(2),
                    ProductName = reader.GetString(3), // ← NEW
                    Quantity = reader.GetInt32(4),
                    Price = reader.GetDecimal(5)
                });

            }

            return items;
        }

        public async Task<int> AddItemAsync(OrderItem item)
        {
            var sql = new StringBuilder(@"
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (@orderId, @productId, @quantity, @price);
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("orderId", item.OrderId);
            command.Parameters.AddWithValue("productId", item.ProductId);
            command.Parameters.AddWithValue("quantity", item.Quantity);
            command.Parameters.AddWithValue("price", item.Price);

            return await command.ExecuteNonQueryAsync();
        }

        public async Task<int> RemoveItemAsync(int id)
        {
            var sql = new StringBuilder("DELETE FROM order_items WHERE id = @id;");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("id", id);

            return await command.ExecuteNonQueryAsync();
        }

        public async Task<int> UpdateItemQuantityAsync(int id, int quantity)
        {
            var sql = new StringBuilder(@"
                UPDATE order_items
                SET quantity = @quantity
                WHERE id = @id;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("id", id);
            command.Parameters.AddWithValue("quantity", quantity);

            return await command.ExecuteNonQueryAsync();
        }
    }
}

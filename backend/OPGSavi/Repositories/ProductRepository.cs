using Microsoft.AspNetCore.Connections;
using Npgsql;
using OPGSavi.Data;
using OPGSavi.Models;
using System.Text;

namespace OPGSavi.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public ProductRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<List<Products>> GetAllProductsAsync()
        {
            var sql = new StringBuilder("SELECT * FROM products;");
            var results = new List<Products>();

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (reader.Read())
            {
                var product = new Products
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Price = reader.GetDecimal(3),
                    Stock = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5)
                };
                results.Add(product);

            }
            return results;
        }

        public async Task<Products?> GetByIdAsync(int id)
        {
            var sql = new StringBuilder("SELECT id, name, description, price, stock, created_at FROM products WHERE id = @id;");
            await using var conn = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await conn.OpenAsync();

            await using var cmd = new NpgsqlCommand(sql.ToString(), conn);
            cmd.Parameters.AddWithValue("id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Products
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Price = reader.GetDecimal(3),
                    Stock = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5)
                };
            }

            return null;
        }

        public async Task<int> CreateAsync(Products product)
        {
            var sql = new StringBuilder(@"
                INSERT INTO products (name, description, price, stock)
                VALUES (@name, @description, @price, @stock)
                RETURNING id, name, description, price, stock, created_at;
            ");

            await using var connection = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await connection.OpenAsync();
            await using var command = new NpgsqlCommand(sql.ToString(), connection);
            command.Parameters.AddWithValue("@name", product.Name);
            command.Parameters.AddWithValue("@description", (object?)product.Description ?? DBNull.Value);
            command.Parameters.AddWithValue("@price", product.Price);
            command.Parameters.AddWithValue("@stock", product.Stock);

            return await command.ExecuteNonQueryAsync();
        }

        public async Task<int> UpdateAsync(Products product)
        {
            var existing = await GetByIdAsync(product.Id);
            if (existing is null) return 0;

            var updatedName = string.IsNullOrWhiteSpace(product.Name) ? existing.Name : product.Name;
            var updatedDescription = string.IsNullOrWhiteSpace(product.Description) ? existing.Description : product.Description;
            var updatedPrice = product.Price == 0 ? existing.Price : product.Price;
            var updatedStock = product.Stock == 0 ? existing.Stock : product.Stock;

            var sql = new StringBuilder(@"
                UPDATE products 
                SET name = @name, description = @description, price = @price, stock = @stock 
                WHERE id = @id;
            ");

            await using var conn = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await conn.OpenAsync();

            await using var cmd = new NpgsqlCommand(sql.ToString(), conn);
            cmd.Parameters.AddWithValue("id", product.Id);
            cmd.Parameters.AddWithValue("name", updatedName);
            cmd.Parameters.AddWithValue("description", (object?)updatedDescription ?? DBNull.Value);
            cmd.Parameters.AddWithValue("price", updatedPrice);
            cmd.Parameters.AddWithValue("stock", updatedStock);

            return await cmd.ExecuteNonQueryAsync();
        }


        public async Task<int> DeleteAsync(int id)
        {
            var sql = new StringBuilder("DELETE FROM products WHERE id = @id;");

            await using var conn = (NpgsqlConnection)_databaseConnection.CreateConnection();
            await conn.OpenAsync();

            await using var cmd = new NpgsqlCommand(sql.ToString(), conn);
            cmd.Parameters.AddWithValue("id", id);

            return await cmd.ExecuteNonQueryAsync();
        }
    }
}


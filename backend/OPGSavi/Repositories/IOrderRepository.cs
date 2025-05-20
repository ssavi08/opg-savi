using OPGSavi.Models;

namespace OPGSavi.Repositories
{
    public interface IOrderRepository
    {
        Task<Order?> GetOpenOrderForUserAsync(int userId);
        Task<int> CreateOrderAsync(Order order);
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
    }
}

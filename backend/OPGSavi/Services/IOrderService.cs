using OPGSavi.Models;

namespace OPGSavi.Services
{
    public interface IOrderService
    {
        Task<Order> GetOrCreateOpenOrderAsync(int userId);
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
    }
}

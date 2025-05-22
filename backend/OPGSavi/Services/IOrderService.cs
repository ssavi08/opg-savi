using OPGSavi.Models;

namespace OPGSavi.Services
{
    public interface IOrderService
    {
        Task<Order> GetOrCreateOpenOrderAsync(int userId);
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
        Task<int> ConfirmOrderAsync(int orderId);
        Task<List<AdminOrderView>> GetAllOrdersForAdminAsync();
        Task<Order?> GetOrderByIdAsync(int orderId);

    }
}

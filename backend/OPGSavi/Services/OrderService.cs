using OPGSavi.Models;
using OPGSavi.Repositories;

namespace OPGSavi.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Order> GetOrCreateOpenOrderAsync(int userId)
        {
            var existing = await _orderRepository.GetOpenOrderForUserAsync(userId);
            if (existing != null)
                return existing;

            var newOrder = new Order
            {
                UserId = userId,
                Total = 0,
                CreatedAt = DateTime.UtcNow,
                Status = "open" // ✅ Ensure status is set to "open"
            };

            newOrder.Id = await _orderRepository.CreateOrderAsync(newOrder);
            return newOrder;
        }

        public Task<List<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return _orderRepository.GetOrdersByUserIdAsync(userId);
        }

        public Task<int> ConfirmOrderAsync(int orderId)
        {
            return _orderRepository.ConfirmOrderAsync(orderId);
        }

        public Task<List<AdminOrderView>> GetAllOrdersForAdminAsync()
        {
            return _orderRepository.GetAllOrdersWithUsersAsync();
        }
        public Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return _orderRepository.GetOrderByIdAsync(orderId);
        }

    }
}

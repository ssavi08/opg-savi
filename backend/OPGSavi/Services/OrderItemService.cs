using OPGSavi.Models;
using OPGSavi.Repositories;

namespace OPGSavi.Services
{
    public class OrderItemService : IOrderItemService
    {
        private readonly IOrderItemRepository _repository;

        public OrderItemService(IOrderItemRepository repository)
        {
            _repository = repository;
        }

        public Task<List<OrderItem>> GetItemsByOrderIdAsync(int orderId)
        {
            return _repository.GetItemsByOrderIdAsync(orderId);
        }

        public Task<int> AddItemAsync(OrderItem item)
        {
            return _repository.AddItemAsync(item);
        }

        public Task<int> RemoveItemAsync(int id)
        {
            return _repository.RemoveItemAsync(id);
        }

        public Task<int> UpdateItemQuantityAsync(int id, int quantity)
        {
            return _repository.UpdateItemQuantityAsync(id, quantity);
        }
    }
}

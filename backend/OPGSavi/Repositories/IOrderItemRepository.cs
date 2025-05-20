using OPGSavi.Models;

namespace OPGSavi.Repositories
{
    public interface IOrderItemRepository
    {
        Task<List<OrderItem>> GetItemsByOrderIdAsync(int orderId);
        Task<int> AddItemAsync(OrderItem item);
        Task<int> RemoveItemAsync(int id);
        Task<int> UpdateItemQuantityAsync(int id, int quantity);
    }
}

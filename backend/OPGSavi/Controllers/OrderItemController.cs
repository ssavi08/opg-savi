using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPGSavi.Services;

namespace OPGSavi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "user")]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItemService _orderItemService;
        private readonly IOrderService _orderService;

        public OrderItemController(IOrderItemService orderItemService, IOrderService orderService)
        {
            _orderItemService = orderItemService;
            _orderService = orderService;
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetItems(int orderId)
        {
            var items = await _orderItemService.GetItemsByOrderIdAsync(orderId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] OrderItem item)
        {
            var result = await _orderItemService.AddItemAsync(item);
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut("{id}/quantity")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int quantity)
        {
            var result = await _orderItemService.UpdateItemQuantityAsync(id, quantity);
            return result > 0 ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var result = await _orderItemService.RemoveItemAsync(id);
            return result > 0 ? Ok() : NotFound();
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPGSavi.Models;
using OPGSavi.Services;
using System.Security.Claims;

namespace OPGSavi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "user")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentOrder()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var order = await _orderService.GetOrCreateOpenOrderAsync(userId);
            return Ok(order);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }
    }
}

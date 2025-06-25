using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPGSavi.Models;
using OPGSavi.Services;
using System.Security.Claims;

namespace OPGSavi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// Get the user's current (open) order. If none exists, it will be created.
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentOrder()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var order = await _orderService.GetOrCreateOpenOrderAsync(userId);
            return Ok(order);
        }

        /// Get all confirmed orders (order history) for the current user.
        [HttpGet("history")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }

        /// Confirm the user's current order (submit it).
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmOrder(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null || order.UserId != userId)
                return Forbid(); // ⛔ User cannot confirm someone else’s order

            var updated = await _orderService.ConfirmOrderAsync(id);
            return updated > 0 ? Ok() : NotFound();
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllOrdersForAdmin()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersForAdminAsync();
                if (orders == null || orders.Count == 0)
                {
                    return Ok(new List<AdminOrderView>());
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error retrieving orders: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving orders.");
            }
        }
    }
}
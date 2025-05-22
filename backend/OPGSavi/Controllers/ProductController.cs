using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPGSavi.Models;
using OPGSavi.Services;

namespace OPGSavi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var products = await _service.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _service.GetProductByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateProduct([FromBody] Products product)
        {
            var result = await _service.CreateProductAsync(product);
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Products product)
        {
            if (id != product.Id) return BadRequest("ID mismatch");

            var result = await _service.UpdateProductAsync(product);
            return result > 0 ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _service.DeleteProductAsync(id);
            return result > 0 ? Ok() : NotFound();
        }
    }
}

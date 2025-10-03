using CicekciBackend.Application.Models;
using CicekciBackend.Application.Services;
using CicekciBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CicekciBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserService _userService;
        private readonly ProductService _productService;
        private readonly OrderService _orderService;

        public AdminController(AppDbContext context, UserService userService,
                             ProductService productService, OrderService orderService)
        {
            _context = context;
            _userService = userService;
            _productService = productService;
            _orderService = orderService;
        }

        // Dashboard istatistikleri
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.Where(o => o.Status == OrderStatus.Delivered).SumAsync(o => o.TotalAmount);
            var pendingOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Pending);

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                PendingOrders = pendingOrders
            });
        }

        // Tüm kullanıcıları getir
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.Role)
                .ThenBy(u => u.FullName)
                .ToListAsync();

            return Ok(users);
        }

        // Kullanıcı rolünü güncelle
        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] AdminUpdateRoleDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.Role = dto.Role;
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // Tüm siparişleri getir
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Courier)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.InsertDate)
                .ToListAsync();

            return Ok(orders);
        }

        // Sipariş durumunu güncelle
        [HttpPut("orders/{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] AdminUpdateStatusDto dto)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            await _orderService.UpdateOrderAsync(order);

            return Ok(order);
        }

        // Siparişe kurye ata
        [HttpPut("orders/{orderId}/assign-courier")]
        public async Task<IActionResult> AssignCourierToOrder(int orderId, [FromBody] AdminAssignCourierDto dto)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null) return NotFound();

            order.CourierId = dto.CourierId;
            order.Status = OrderStatus.AssignedToCourier;
            await _orderService.UpdateOrderAsync(order);

            return Ok(order);
        }

        // Yeni ürün ekle
        [HttpPost("products")]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            var added = await _productService.AddProductAsync(product);
            return Ok(added);
        }

        // Ürünü güncelle
        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest();
            await _productService.UpdateProductAsync(product);
            return NoContent();
        }

        // Ürünü sil (soft delete)
        [HttpPut("products/{id}/deactivate")]
        public async Task<IActionResult> DeactivateProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();

            product.IsActive = false;
            await _productService.UpdateProductAsync(product);

            return Ok(product);
        }
    }

    // ✅ AdminController'a özel DTO'lar (OrderController'dakilerden farklı isimler)
    public class AdminUpdateRoleDto
    {
        public UserRole Role { get; set; }
    }

    public class AdminUpdateStatusDto
    {
        public OrderStatus Status { get; set; }
    }

    public class AdminAssignCourierDto
    {
        public int CourierId { get; set; }
    }
}
using CicekciBackend.Application.Models;
using CicekciBackend.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace CicekciBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;
        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            // ✅ Circular reference'ı önlemek için OrderItems'ın Order property'sini null yap
            var order = new Order
            {
                UserId = dto.UserId,
                ShippingAddress = dto.ShippingAddress,
                TotalAmount = dto.TotalAmount,
                Status = OrderStatus.Pending,
                OrderItems = dto.Items.ConvertAll(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Order = null // ✅ SADECE BU SATIRI EKLE
                })
            };

            var createdOrder = await _orderService.CreateOrderAsync(order);

            // ✅ Basit response döndür
            return Ok(new
            {
                message = "Sipariş başarıyla oluşturuldu",
                orderId = createdOrder.Id,
                status = createdOrder.Status.ToString()
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPut("{id}/assign-courier")]
        public async Task<IActionResult> AssignCourier(int id, [FromBody] AssignCourierDto dto)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            order.CourierId = dto.CourierId;
            order.Status = OrderStatus.AssignedToCourier;
            await _orderService.UpdateOrderAsync(order);

            return Ok(order);
        }

        [HttpPut("{id}/mark-delivered")]
        public async Task<IActionResult> MarkDelivered(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            order.Status = OrderStatus.Delivered;
            await _orderService.UpdateOrderAsync(order);

            return Ok(order);
        }

        // Kuryenin siparişlerini getir
        [HttpGet("courier/{courierId}")]
        public async Task<IActionResult> GetCourierOrders(int courierId)
        {
            return Ok(new { message = "Bu metod henüz implemente edilmedi" });
        }

        // Müsait siparişleri getir
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableOrders()
        {
            return Ok(new { message = "Bu metod henüz implemente edilmedi" });
        }

        // Sipariş durumunu güncelle
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderUpdateStatusDto dto)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            await _orderService.UpdateOrderAsync(order);

            return Ok(order);
        }
    }

    // DTO'lar - AYNI KALSIN
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public System.Collections.Generic.List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class AssignCourierDto
    {
        public int CourierId { get; set; }
    }

    public class OrderUpdateStatusDto
    {
        public OrderStatus Status { get; set; }
    }
}
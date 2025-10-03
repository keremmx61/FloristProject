using CicekciBackend.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CicekciBackend.Api.Controllers
{
    public class CreateOrderRequestDto
    {
        public int UserId { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public System.Collections.Generic.List<OrderItemRequestDto> Items { get; set; }
    }

    public class OrderItemRequestDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class AssignCourierRequestDto
    {
        public int CourierId { get; set; }
    }

    public class UpdateOrderStatusRequestDto
    {
        public OrderStatus Status { get; set; }
    }
}

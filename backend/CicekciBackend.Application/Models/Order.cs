namespace CicekciBackend.Application.Models
{
    public enum OrderStatus
    {
        Pending,
        Preparing,
        AssignedToCourier,
        InTransit,
        Delivered,
        Cancelled
    }

    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int? CourierId { get; set; } // atanmış kurye
        public User Courier { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public DateTime InsertDate { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
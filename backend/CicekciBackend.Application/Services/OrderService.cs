using CicekciBackend.Application.Interfaces;
using CicekciBackend.Application.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CicekciBackend.Application.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            // ✅ SADECE BU KISMI EKLE: Circular reference'ı önle
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    item.Order = null; // Circular reference'ı kır
                }
            }

            await _orderRepository.AddAsync(order);
            return order;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync() =>
            await _orderRepository.GetAllAsync();

        public async Task<Order> GetOrderByIdAsync(int id) =>
            await _orderRepository.GetByIdAsync(id);

        public async Task UpdateOrderAsync(Order order)
        {
            // ✅ SADECE BU KISMI EKLE: Güncellemeden önce circular reference'ı önle
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    item.Order = null;
                }
            }

            await _orderRepository.UpdateAsync(order);
        }

        public async Task DeleteOrderAsync(int id) =>
            await _orderRepository.DeleteAsync(id);
    }
}
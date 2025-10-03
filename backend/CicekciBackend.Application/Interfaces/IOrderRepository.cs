﻿using CicekciBackend.Application.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CicekciBackend.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task AddAsync(Order order);
        Task UpdateAsync(Order order);
        Task DeleteAsync(int id);
    }
}
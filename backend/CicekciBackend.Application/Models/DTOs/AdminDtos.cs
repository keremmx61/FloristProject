using CicekciBackend.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CicekciBackend.Api.Controllers
{
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

namespace CicekciBackend.Application.Models
{
    public enum UserRole
    {
        Customer,
        Courier,
        Admin
    }

    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime InsertDate { get; set; } = DateTime.UtcNow;
    }
}
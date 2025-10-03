using CicekciBackend.Application.Interfaces;
using CicekciBackend.Application.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;

namespace CicekciBackend.Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> RegisterAsync(string fullName, string email, string password, UserRole role)
        {
            var existing = await _userRepository.GetByEmailAsync(email);
            if (existing != null) return null;

            var user = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            };

            await _userRepository.AddAsync(user);
            return user;
        }

        public async Task<User> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return null;

            bool verified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return verified ? user : null;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync() => await _userRepository.GetAllAsync();
    }
}
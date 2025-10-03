using CicekciBackend.Application.Models;
using CicekciBackend.Application.Services;
using CicekciBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace CicekciBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public AuthController(UserService userService, ITokenService tokenService, IConfiguration configuration)
        {
            _userService = userService;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = await _userService.RegisterAsync(dto.FullName, dto.Email, dto.Password, dto.Role);
            if (user == null) return BadRequest("Email already exists.");
            return Ok(new { user.Id, user.FullName, user.Email, user.Role });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.LoginAsync(dto.Email, dto.Password);
            if (user == null) return Unauthorized("Invalid credentials.");

            var token = _tokenService.GenerateAccessToken(user);

            // appsettings.json içinden süreyi al
            var expiryMinutes = _configuration.GetValue<int>("Jwt:ExpiryMinutes", 60);

            return Ok(new
            {
                token,
                expiresInMinutes = expiryMinutes,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }
    }

    // DTO’lar
    public class RegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

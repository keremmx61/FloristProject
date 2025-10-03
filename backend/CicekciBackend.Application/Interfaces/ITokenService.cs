using CicekciBackend.Application.Models;

namespace CicekciBackend.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
    }
}
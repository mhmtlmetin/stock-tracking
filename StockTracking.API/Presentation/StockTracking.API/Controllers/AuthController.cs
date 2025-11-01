using Microsoft.AspNetCore.Mvc;
using StockTracking.Application.Interfaces;

namespace StockTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenGeneratorService _tokenGenerator;

        public AuthController(ITokenGeneratorService tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // burada basit bir örnek yaptım, gerçek senaryoda DB kontrolü yapılır
            if (request.Username == "admin" && request.Password == "1234")
            {
                var token = _tokenGenerator.GenerateToken(request.Username, "Admin");
                return Ok(new { token });
            }
            return Unauthorized();
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

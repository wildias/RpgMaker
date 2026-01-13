using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RpgMaker.Api.Data;
using RpgMaker.Api.Model;
using RpgMaker.Api.Model.Response;
using RpgMaker.Api.Model.ViewModel;
using RpgMaker.Api.Services;
using RpgMaker.Api.Util;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RpgMaker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly RpgMakerContext _context;
        private readonly UsuarioService _usuarioService;

        public AuthController(IConfiguration config, RpgMakerContext context, UsuarioService usuarioService)
        {
            _config = config;
            _context = context;
            _usuarioService = usuarioService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioViewModel login)
        {

            var user = await _context.Usuario.FirstOrDefaultAsync(u => u.Username == login.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return BadRequest("Credenciais inválidas.");
            }

            var jwtToken = GenerateJwtToken(user);
            return Ok(new { token = jwtToken });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UsuarioViewModel request)
        {
            if (await _context.Usuario.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("O nome de usuário já existe.");
            }

            var novoCadastro = await _usuarioService.CadastrarUsuario(request);

            if (novoCadastro == null) return BadRequest("Erro ao registrar usuário.");

            return Ok("Usuário registrado com sucesso.");
        }

        [HttpGet("usuarios")]
        public async Task<ActionResult<IEnumerable<UsuarioResponse>>> GetUsuarios()
        {
            var usuarios = await _usuarioService.BuscarUsuarios();

            return Ok(usuarios);
        }


        public string GenerateJwtToken(Usuario user)
        {
            var claims = new List<Claim>();

            if (user != null)
            {
                claims = new List<Claim>()
                {
                    new Claim("userId", user.UsuarioId.ToString()),
                    new Claim("userName", user.Username),
                    new Claim("role", user.Role.ToString()),
                };
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


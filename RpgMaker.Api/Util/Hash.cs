using Microsoft.IdentityModel.Tokens;
using RpgMaker.Api.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RpgMaker.Api.Util
{
    public class Hash
    {
        public readonly IConfiguration _config;

        public Hash(IConfiguration config)
        {
            _config = config;
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

using RpgMaker.Api.Model.Enum;

namespace RpgMaker.Api.Model
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public RolesEnum Role { get; set; }
        public DateTime Registro { get; set; }
    }
}

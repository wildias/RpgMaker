using Microsoft.EntityFrameworkCore;
using RpgMaker.Api.Data;
using RpgMaker.Api.Model;
using RpgMaker.Api.Model.ViewModel;

namespace RpgMaker.Api.Services
{
    public class UsuarioService
    {
        private readonly RpgMakerContext _context;

        public UsuarioService(RpgMakerContext context)
        {
            _context = context;
        }

        internal async Task<Usuario> CadastrarUsuario(UsuarioViewModel request)
        {
            try
            {
                var usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.Username == request.Username);

                if (usuario != null) return null;

                var novoUsuario = new Usuario
                {
                    Username = request.Username,
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Registro = DateTime.UtcNow,
                    Role = Model.Enum.RolesEnum.Player
                };

                _context.Usuario.Add(novoUsuario);

                await _context.SaveChangesAsync();

                return novoUsuario;
            }
            catch (Exception ex)
            {

                return null;
            }
        }
    }
}

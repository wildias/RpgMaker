using Microsoft.EntityFrameworkCore;
using RpgMaker.Api.Data;
using RpgMaker.Api.Model;
using RpgMaker.Api.Model.Enum;
using RpgMaker.Api.Model.ViewModel;
using RpgMaker.Api.Util;

namespace RpgMaker.Api.Services
{
    public class PersonagemService
    {
        private readonly RpgMakerContext _context;

        public PersonagemService(RpgMakerContext context)
        {
            _context = context;
        }

        internal async Task<bool> CriarPersonagem(int userId, PersonagemViewModel request)
        {
            try
            {
                var usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.UsuarioId == userId);

                var novoPersonagem = new Personagem
                {
                    Usuario = usuario,
                    Nome = request.Name,
                    NumeroIdentificacao = request.NumeroIdentificacao,
                    Aptidao = request.Aptidao,
                    Ficha = request.Ficha,
                    Imagem = request.Imagem != null ? ImagemUtil.ComprimirImagemBase64ParaBytes(request.Imagem) : null,
                    PX_Atual = 0,
                    PX_Total = 0,
                    Reino = Enum.Parse<ReinoEnum>(request.Reino)
                };

                _context.Personagem.Add(novoPersonagem);

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }
    }
}

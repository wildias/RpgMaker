using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RpgMaker.Api.Data;
using RpgMaker.Api.Hubs;
using RpgMaker.Api.Model;
using RpgMaker.Api.Model.Enum;
using RpgMaker.Api.Model.Response;
using RpgMaker.Api.Model.ViewModel;
using RpgMaker.Api.Util;

namespace RpgMaker.Api.Services
{
    public class PersonagemService
    {
        private readonly RpgMakerContext _context;
        private readonly IHubContext<PersonagemHub> _hubContext;

        public PersonagemService(RpgMakerContext context, IHubContext<PersonagemHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        internal async Task<bool> CriarPersonagem(int userId, PersonagemViewModel request)
        {
            try
            {
                var usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.UsuarioId == userId);

                if (usuario == null) return false;

                var novoPersonagem = new Personagem
                {
                    Usuario = usuario,
                    Nome = request.Nome,
                    NumeroIdentificacao = request.NumeroIdentificacao,
                    Aptidao = request.Aptidao,
                    Ficha = request.Ficha,
                    Imagem = request.Imagem != null ? ImagemUtil.ComprimirImagemBase64ParaBytes(request.Imagem) : null,
                    PX_Atual = 0,
                    PX_Total = 0,
                    Reino = ExEnum.FromDescricao(request.Reino),
                    Idade = request.Idade,
                    Level = 0
                };

                _context.Personagem.Add(novoPersonagem);

                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("PersonagemCriado", novoPersonagem);

                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        internal async Task<bool> AlterarPersonagem(int personagemId, PersonagemViewModel request)
        {
            try
            {
                var personagem = await _context.Personagem.FirstOrDefaultAsync(u => u.PersonagemId == personagemId);

                if (personagem == null) return false;

                personagem.Nome = request.Nome;
                personagem.Ficha = request.Ficha;
                personagem.Imagem = request.Imagem != null ? ImagemUtil.ComprimirImagemBase64ParaBytes(request.Imagem) : personagem.Imagem;
                personagem.Level = request.Level;

                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("PersonagemAtualizado", personagem);

                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        internal async Task<bool> DistribuirPX(List<DistribuirPXViewModel> request)
        {
            try
            {
                foreach (var p in request)
                {
                    var personagem = await _context.Personagem.FirstOrDefaultAsync(ps => ps.PersonagemId == p.PersonagemId);

                    personagem.PX_Atual = (personagem.PX_Atual + p.Px);
                    personagem.PX_Total = (personagem.PX_Total + p.Px);
                }

                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("PXDistribuido");
                return true;

            }
            catch (Exception ex)
            {

                return false;
            }
        }

        internal async Task<PersonagemResponse> BuscarPersonagem(int userId)
        {
            try
            {
                var personagem = await _context.Personagem
                    .Where(p => p.Usuario.UsuarioId == userId)
                    .Select(p => new PersonagemResponse
                    {
                        PersonagemId = p.PersonagemId,
                        Nome = p.Nome,
                        Aptidao = p.Aptidao,
                        NumeroIdentificacao = p.NumeroIdentificacao,
                        Ficha = p.Ficha,
                        Imagem = p.Imagem != null ? ImagemUtil.DescomprimirImagemParaBase64(p.Imagem) : null,
                        PX_Atual = p.PX_Atual,
                        PX_Total = p.PX_Total,
                        Reino = ExEnum.GetDescricao(p.Reino),
                        Idade = p.Idade,
                        Level = p.Level
                    })
                    .FirstOrDefaultAsync();

                return personagem;
            }
            catch (Exception ex)
            {

                return null;
            }
        }

        internal async Task<ICollection<PersonagemResponse>> BuscarPersonagens()
        {
            try
            {
                var personagens = await _context.Personagem
                    .Select(p => new PersonagemResponse
                    {
                        PersonagemId = p.PersonagemId,
                        Nome = p.Nome,
                        Aptidao = p.Aptidao,
                        NumeroIdentificacao = p.NumeroIdentificacao,
                        Ficha = p.Ficha,
                        Imagem = p.Imagem != null ? ImagemUtil.DescomprimirImagemParaBase64(p.Imagem) : null,
                        PX_Atual = p.PX_Atual,
                        PX_Total = p.PX_Total,
                        Reino = ExEnum.GetDescricao(p.Reino),
                        Idade = p.Idade,
                        Level = p.Level
                    })
                    .ToListAsync();

                return personagens;
            }
            catch (Exception ex)
            {

                return null;
            }
        }
    }
}

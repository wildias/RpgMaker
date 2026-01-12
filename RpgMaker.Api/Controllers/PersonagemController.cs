using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RpgMaker.Api.Model.ViewModel;
using RpgMaker.Api.Services;

namespace RpgMaker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class PersonagemController : ControllerBase
    {
        private readonly PersonagemService _personagemService;

        public PersonagemController(PersonagemService personagemService)
        {
            _personagemService = personagemService;
        }

        [HttpPost("criar")]
        public async Task<IActionResult> Login(int usuarioId, [FromBody] PersonagemViewModel personagem)
        {
            var novoPersonagem = await _personagemService.CriarPersonagem(usuarioId, personagem);

            if (novoPersonagem)
            {
                return Ok("Personagem criado com sucesso");
            }

            return BadRequest("Erro ao criar personagem");
        }

        [HttpPut("atualizar/{personagemId}")]
        public async Task<IActionResult> EditarPersonagem(int personagemId, [FromBody] PersonagemViewModel personagem)
        {
            var atualizarPersonagem = await _personagemService.AlterarPersonagem(personagemId, personagem);

            if (atualizarPersonagem)
            {
                return Ok("Personagem atualizado com sucesso");
            }

            return BadRequest("Erro ao atualizar personagem");
        }

        [HttpPut("atualizarpx/{personagemId}")]
        public async Task<IActionResult> DistribuirPX(int personagemId, long px, bool paraTodos)
        {
            var destribuirPX = await _personagemService.DistribuirPX(personagemId, px, paraTodos);

            if (destribuirPX)
            {
                return Ok("PX distribuido com sucesso");
            }

            return BadRequest("Erro ao distribuir px");
        }
    }
}

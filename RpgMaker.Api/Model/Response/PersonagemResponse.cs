using RpgMaker.Api.Model.Enum;

namespace RpgMaker.Api.Model.Response
{
    public class PersonagemResponse
    {
        public int PersonagemId { get; set; }
        public string Nome { get; set; }
        public long NumeroIdentificacao { get; set; }
        public string Reino { get; set; }
        public string Aptidao { get; set; }
        public long PX_Atual { get; set; }
        public long PX_Total { get; set; }
        public string Imagem { get; set; }
        public string Ficha { get; set; }
        public int Idade { get; set; }
    }
}

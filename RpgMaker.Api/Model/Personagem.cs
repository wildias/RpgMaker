using RpgMaker.Api.Model.Enum;

namespace RpgMaker.Api.Model
{
    public class Personagem
    {
        public int PersonagemId { get; set; }
        public Usuario Usuario { get; set; }
        public string Nome { get; set; }
        public long NumeroIdentificacao { get; set; }
        public ReinoEnum Reino {  get; set; }
        public string Aptidao { get; set; }
        public long PX_Atual {  get; set; }
        public long PX_Total {  get; set; }
        public byte[] Imagem { get; set; }
        public string Ficha { get; set; }
        public int Idade { get; set; }
        public int Level { get; set; }
    }
}

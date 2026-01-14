using RpgMaker.Api.Model.Enum;

namespace RpgMaker.Api.Util
{
    public static class ExEnum
    {
        public static string GetDescricao(this ReinoEnum secao)
        {
            return secao switch
            {
                ReinoEnum.Indrun => "Indrún",
                ReinoEnum.Fadalor => "Fadalór",
                ReinoEnum.LargoGelido => "Largo Gélido",
                ReinoEnum.YutaiGuarani => "Yatai Guarani",
                ReinoEnum.Trondor => "Trondór",
                _ => secao.ToString()
            };
        }

        public static ReinoEnum FromDescricao(string descricao)
        {
            foreach (var valor in Enum.GetValues<ReinoEnum>())
            {
                if (string.Equals(valor.GetDescricao(), descricao, StringComparison.OrdinalIgnoreCase))
                    return valor;
            }

            throw new ArgumentException($"Reino inválido: {descricao}");
        }
    }
}

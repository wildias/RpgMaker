using System.IO.Compression;

namespace RpgMaker.Api.Util
{
    public static class ImagemUtil
    {
        public static string DescomprimirImagemParaBase64(byte[] imagemComprimida)
        {
            using var input = new MemoryStream(imagemComprimida);
            using var gzip = new GZipStream(input, CompressionMode.Decompress);
            using var output = new MemoryStream();
            gzip.CopyTo(output);
            return Convert.ToBase64String(output.ToArray());
        }

        public static byte[] ComprimirImagemBase64ParaBytes(string imagemBase64)
        {
            imagemBase64 = imagemBase64.Substring(imagemBase64.IndexOf(",") + 1);
            var imagemBytes = Convert.FromBase64String(imagemBase64);

            using var output = new MemoryStream();
            using (var gzip = new GZipStream(output, CompressionMode.Compress, leaveOpen: true))
            {
                gzip.Write(imagemBytes, 0, imagemBytes.Length);
            }

            return output.ToArray();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace RpgMaker.Api.Data
{
    public class RpgMakerContextFactory : IDesignTimeDbContextFactory<RpgMakerContext>
    {
        public RpgMakerContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<RpgMakerContext>();

            //var connectionString =
            //    "Server=localhost;Database=rpgmaker;User=root;Password=ab12c3;";
            var connectionString =
                "Server=mysql.railway.internal;Port=3306;Database=railway;User=root;Password=eJbHnjyxSstZFxubyYopmhpXvJsKIoCR";

            optionsBuilder.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString)
            );

            return new RpgMakerContext(optionsBuilder.Options);
        }
    }
}

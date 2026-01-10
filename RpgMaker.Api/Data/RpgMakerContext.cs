using Microsoft.EntityFrameworkCore;
using RpgMaker.Api.Model;

namespace RpgMaker.Api.Data
{
    public class RpgMakerContext : DbContext
    {
        public RpgMakerContext(DbContextOptions<RpgMakerContext> options)
            : base(options)
        {
        }

        public DbSet<Personagem> Personagem { get; set; }
        public DbSet<Usuario> Usuario { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}

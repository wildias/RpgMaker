using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RpgMaker.Api.Migrations
{
    /// <inheritdoc />
    public partial class adicionandoColunaIdade_TabelaPersonagem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Idade",
                table: "Personagem",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Idade",
                table: "Personagem");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace AgileDiary2.Data.Migrations
{
    public partial class AddResultOrigin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResultOrigin",
                table: "Result",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResultOrigin",
                table: "Result");
        }
    }
}

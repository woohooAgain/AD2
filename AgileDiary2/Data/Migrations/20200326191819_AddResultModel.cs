using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AgileDiary2.Data.Migrations
{
    public partial class AddResultModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Result",
                columns: table => new
                {
                    ResultId = table.Column<Guid>(nullable: false),
                    Thanks = table.Column<string>(nullable: true),
                    Achievement = table.Column<string>(nullable: true),
                    Lesson = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: true),
                    WeekNumber = table.Column<int>(nullable: true),
                    SprintId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Result", x => x.ResultId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Result");
        }
    }
}

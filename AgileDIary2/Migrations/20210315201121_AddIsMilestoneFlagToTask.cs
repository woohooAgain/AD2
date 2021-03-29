using Microsoft.EntityFrameworkCore.Migrations;

namespace AgileDiary2.Migrations
{
    public partial class AddIsMilestoneFlagToTask : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMilestone",
                table: "Tasks",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMilestone",
                table: "Tasks");
        }
    }
}

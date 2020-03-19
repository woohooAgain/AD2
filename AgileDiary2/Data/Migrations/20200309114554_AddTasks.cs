using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AgileDiary2.Data.Migrations
{
    public partial class AddTasks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    MyTaskId = table.Column<Guid>(nullable: false),
                    Creator = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    PlanDate = table.Column<DateTime>(nullable: false),
                    Completed = table.Column<bool>(nullable: false),
                    GoalId = table.Column<Guid>(nullable: true),
                    Priority = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.MyTaskId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tasks");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace AgileDiary2.Migrations
{
    public partial class NecessaryGoalIdForTask : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Goals_GoalId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "SprintId",
                table: "Tasks");

            migrationBuilder.AlterColumn<int>(
                name: "GoalId",
                table: "Tasks",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Goals_GoalId",
                table: "Tasks",
                column: "GoalId",
                principalTable: "Goals",
                principalColumn: "GoalId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Goals_GoalId",
                table: "Tasks");

            migrationBuilder.AlterColumn<int>(
                name: "GoalId",
                table: "Tasks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "SprintId",
                table: "Tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Goals_GoalId",
                table: "Tasks",
                column: "GoalId",
                principalTable: "Goals",
                principalColumn: "GoalId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

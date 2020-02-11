using Microsoft.EntityFrameworkCore.Migrations;

namespace AgileDiary2.Data.Migrations
{
    public partial class AddMilestones2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Milestone_Goals_GoalId",
                table: "Milestone");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Milestone",
                table: "Milestone");

            migrationBuilder.RenameTable(
                name: "Milestone",
                newName: "Milestones");

            migrationBuilder.RenameIndex(
                name: "IX_Milestone_GoalId",
                table: "Milestones",
                newName: "IX_Milestones_GoalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Milestones",
                table: "Milestones",
                column: "MilestoneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Milestones_Goals_GoalId",
                table: "Milestones",
                column: "GoalId",
                principalTable: "Goals",
                principalColumn: "GoalId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Milestones_Goals_GoalId",
                table: "Milestones");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Milestones",
                table: "Milestones");

            migrationBuilder.RenameTable(
                name: "Milestones",
                newName: "Milestone");

            migrationBuilder.RenameIndex(
                name: "IX_Milestones_GoalId",
                table: "Milestone",
                newName: "IX_Milestone_GoalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Milestone",
                table: "Milestone",
                column: "MilestoneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Milestone_Goals_GoalId",
                table: "Milestone",
                column: "GoalId",
                principalTable: "Goals",
                principalColumn: "GoalId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

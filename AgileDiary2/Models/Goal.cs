using System.Collections.Generic;

namespace AgileDiary2.Models
{
    public class Goal
    {
        public int GoalId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Reward { get; set; }
        public int SprintId { get; set; }
        public ICollection<MyTask> Milestones { get; set; }
        public Area Area { get; set; }
    }

    public enum Area
    {
        Undefined,
        Development,
        Career,
        Relations,
        Other
    }
}

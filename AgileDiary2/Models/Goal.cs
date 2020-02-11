using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgileDiary2.Models
{
    public class Goal
    {
        public Guid GoalId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Reward { get; set; }
        public Guid SprintId { get; set; }
        public Sprint Sprint { get; set; }
        public ICollection<Milestone> Milestones { get; set; }
    }
}

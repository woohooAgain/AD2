using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing.Matching;

namespace AgileDiary2.Models
{
    public class Milestone
    {
        public Guid MilestoneId { get; set; }
        public string Description { get; set; }
        public DateTime ApproximateDate { get; set; }
        public Guid GoalId { get; set; }
        public bool Reached { get; set; }
        public Goal Goal { get; set; }
    }
}

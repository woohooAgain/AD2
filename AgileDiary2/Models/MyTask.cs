using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgileDiary2.Models
{
    public class MyTask
    {
        public Guid MyTaskId { get; set; }
        public Guid Creator { get; set; }
        public string Title { get; set; }
        public DateTime PlanDate { get; set; }
        public bool Completed { get; set; }
        public Guid? GoalId { get; set; }
        public bool Priority { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgileDiary2.Models
{
    public class MyTask
    {
        public int MyTaskId { get; set; }
        public Guid Creator { get; set; }
        public string Title { get; set; }
        public string Condition { get; set; }
        public DateTime EstimatedDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public int GoalId { get; set; }
        public Priority Priority { get; set; }
        public Status Status { get; set; }
    }

    public enum Status
    {
        Undefined,
        Finished,
        Backlog,
        Planned
    }

    public enum Priority
    {
        Undefined,
        Low,
        High
    }
}

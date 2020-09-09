using System;
using System.Collections.Generic;

namespace AgileDiary2.Models
{
    public class Sprint
    {
        public ulong SprintId { get; set; }
        public ulong Creator { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Title { get; set; }
        public Status Status { get; set; }
        public ICollection<Goal> Goals { get; set; }
        public ICollection<Result> Results { get; set; }
        public ICollection<Habit> Habits { get; set; }
    }
}

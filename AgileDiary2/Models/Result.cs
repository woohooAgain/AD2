using System;
using System.Collections.Generic;

namespace AgileDiary2.Models
{
    public class Result
    {
        public int ResultId { get; set; }
        public string Thanks { get; set; }
        public string Achievement { get; set; }
        public string Lesson { get; set; }
        public DateTime Date { get; set; }
        public int SprintId { get; set; }
        public ResultType ResultType { get; set; }
        public ICollection<Habit> CompletedHabits { get; set; }
    }

    public enum ResultType
    {
        Undefined,
        Sprint,
        Week,
        Day
    }
}

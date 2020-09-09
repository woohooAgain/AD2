using System;
using System.Collections.Generic;

namespace AgileDiary2.Models
{
    public class Result
    {
        public ulong ResultId { get; set; }
        public string Thanks { get; set; }
        public string Achievement { get; set; }
        public string Lesson { get; set; }
        public DateTime Date { get; set; }
        public ulong SprintId { get; set; }
        public ResultType ResultType { get; set; }
        public ICollection<ulong> CompletedHabits { get; set; }
    }

    public enum ResultType
    {
        Undefined,
        Sprint,
        Week,
        Day
    }
}

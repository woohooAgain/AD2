using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgileDiary2.Models
{
    public class Result
    {
        public Guid ResultId { get; set; }
        public string Thanks { get; set; }
        public string Achievement { get; set; }
        public string Lesson { get; set; }
        public DateTime? Date { get; set; }
        public int? WeekNumber { get; set; }
        public Guid? SprintId { get; set; }
    }
}

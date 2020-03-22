using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgileDiary2.Models
{
    public class Sprint
    {
        public Guid SprintId { get; set; }
        public Guid Creator { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Title { get; set; }
        public bool Finished { get; set; }
        public ICollection<Goal> Goals { get; set; }
    }
}

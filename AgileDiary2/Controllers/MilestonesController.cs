using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgileDiary2.Data;
using AgileDiary2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AgileDiary2.Controllers
{
    [Authorize]
    [Route("milestones")]
    [ApiController]
    public class MilestonesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public MilestonesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("list/{sprintId}")]
        public IEnumerable<Milestone> List(string sprintId)
        {
            var result = new List<Milestone>();
            var goalIds = _context.Goals.Where(s => s.SprintId.ToString() == sprintId).Select(g => g.GoalId.ToString().ToLower());
            var milestones = _context.Milestones.ToList();
            foreach (var goalId in goalIds)
            {
                result.AddRange(milestones.Where(m => m.GoalId.ToString() == goalId));
            }
            return result;
        }
    }
}
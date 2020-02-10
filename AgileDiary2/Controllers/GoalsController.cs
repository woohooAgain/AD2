using System.Collections.Generic;
using System.Linq;
using AgileDiary2.Data;
using AgileDiary2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgileDiary2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("goals")]
    public class GoalsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public GoalsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("list/{sprintId}")]
        public IEnumerable<Goal> List(string sprintId)
        {
            var goals = _context.Goals.Where(s => s.SprintId.ToString() == sprintId);
            return goals;
        }

        [HttpGet]
        [Route("get/{goalId}")]
        public Goal Get(string goalId)
        {
            var result = _context.Goals.FirstOrDefault(s => s.GoalId.ToString() == goalId);
            return result;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

        [HttpPost]
        [Route("create")]
        public string Post([FromBody]Goal goal)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var creator = new Guid(currentUser); goal.Milestones = new List<MyTask>
                {
                    new MyTask
                    {
                        Title = "First step",
                        Creator = creator,
                        EstimatedDate = DateTime.Now.Date,
                        Status = Status.Planned
                    },
                    new MyTask
                    {
                        Title = "Second step",
                        Creator = creator,
                        EstimatedDate = DateTime.Now.Date,
                        Status = Status.Planned
                    },
                    new MyTask
                    {
                        Title = "Third step",
                        Creator = creator,
                        EstimatedDate = DateTime.Now.Date,
                        Status = Status.Planned
                    }
                };
            _context.Goals.Add(goal);
            _context.SaveChanges();
            return goal.GoalId.ToString();
        }

        [HttpGet]
        [Route("get/{goalId}")]
        public Goal Get(int goalId)
        {
            var result = _context.Goals.Include(g => g.Milestones).FirstOrDefault(s => s.GoalId == goalId);
            return result;
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<Goal> List()
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userSprints = _context.Sprints.Where(s => s.Creator.ToString().Equals(currentUser));
            var goals = new HashSet<Goal>(3 * userSprints.Count());
            foreach (var sprint in userSprints)
            {
                var sprintGoals = _context.Goals.Where(g => g.SprintId.Equals(sprint.SprintId));
                foreach (var sprintGoal in sprintGoals)
                {
                    goals.Add(sprintGoal);
                }
            }

            return goals;
        }

        [HttpPut]
        [Route("edit")]
        public Goal Put([FromBody]Goal goal)
        {
            _context.Update(goal);
            _context.SaveChanges();
            return _context.Goals.First(t => t.GoalId.Equals(goal.GoalId));
        }

        [HttpDelete]
        [Route("delete")]
        public bool Delete(int goalId)
        {
            var goal = _context.Goals.FirstOrDefault(g => g.GoalId == goalId);
            _context.Goals.Remove(goal);
            _context.SaveChanges();
            return true;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AgileDiary2.Data;
using AgileDiary2.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgileDiary2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("sprint")]
    public class SprintController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SprintController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<Sprint> List()
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var sprints = _context.Sprints.Where(s => s.Creator.ToString() == currentUser);
            return sprints;
        }

        [HttpGet]
        [Route("get/{sprintId}")]
        public Sprint Get(string sprintId)
        {
            var result = _context.Sprints.Include(s => s.Goals).ThenInclude(g => g.Milestones).FirstOrDefault(s => s.SprintId.ToString() == sprintId);
            return result;
        }

        [HttpPost]
        [Route("create")]
        public string Post([FromBody]Sprint sprint)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            sprint.Creator = new Guid(currentUser);
            sprint.SprintId = Guid.NewGuid();
            sprint.StartDate = DateTime.Now.Date;
            sprint.EndDate = DateTime.Now.Date.AddDays(63);
            sprint.Goals = new List<Goal>
            {
                new Goal
                {
                    Title = "Goal 1",
                    Description = "Finish goal 1",
                    GoalId = Guid.NewGuid(),
                    Reward = "I will be the best at goal 1"
                },
                new Goal
                {
                    Title = "Goal 2",
                    Description = "Finish goal 2",
                    GoalId = Guid.NewGuid(),
                    Reward = "I will be the best at goal 2"
                },
                new Goal
                {
                    Title = "Goal 3",
                    Description = "Finish goal 3",
                    GoalId = Guid.NewGuid(),
                    Reward = "I will be the best at goal 3"
                }
            };
            foreach (var goal in sprint.Goals)
            {
                goal.Milestones = new List<Milestone>
                {
                    new Milestone
                    {
                        Description = "First step",
                        MilestoneId = Guid.NewGuid(),
                        ApproximateDate = sprint.StartDate.AddDays(16)
                    },
                    new Milestone
                    {
                        Description = "Second step",
                        MilestoneId = Guid.NewGuid(),
                        ApproximateDate = sprint.StartDate.AddDays(32)
                    },
                    new Milestone
                    {
                        Description = "Third step",
                        MilestoneId = Guid.NewGuid(),
                        ApproximateDate = sprint.StartDate.AddDays(47)
                    }
                };
            }

            _context.Sprints.Add(sprint);
            _context.SaveChanges();
            return sprint.SprintId.ToString();
        }

        [HttpPut]
        [Route("edit")]
        public Sprint Put(Sprint sprint)
        {
            _context.Update(sprint);
            _context.SaveChanges();
            return _context.Sprints.FirstOrDefault(s => s.SprintId == sprint.SprintId);
        }

        [HttpDelete]
        [Route("delete")]
        public bool Delete(string[] sprintIds)
        {
            var sprintsToDelete = new List<Sprint>(sprintIds.Length);
            foreach (var id in sprintIds)
            {
                sprintsToDelete.Add(_context.Sprints.First(s => s.SprintId.Equals(new Guid(id))));
            }
            _context.RemoveRange(sprintsToDelete);
            _context.SaveChanges();
            return true;
        }
    }
}

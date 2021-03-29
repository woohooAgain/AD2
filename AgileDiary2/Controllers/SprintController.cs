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
            foreach (var g in result.Goals)
            {
                var tasks = g.Milestones;
                for (int i = 0; i < tasks.Count; i++)
                {
                    var t = tasks.ElementAt(i);
                    if (!t.IsMilestone)
                    {
                        tasks.Remove(t);
                    }
                }
            }
            return result;
        }

        [HttpPost]
        [Route("create")]
        public string Post([FromBody]Sprint sprint)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var creator = new Guid(currentUser);
            sprint.Creator = creator;
            sprint.StartDate = DateTime.Now.Date;
            sprint.EndDate = DateTime.Now.Date.AddDays(63);

            sprint.Goals = new List<Goal>
            {
                new Goal
                {
                    Title = "Goal 1",
                    Description = "Finish goal 1",
                    Reward = "I will be the best at goal 1"
                },
                new Goal
                {
                    Title = "Goal 2",
                    Description = "Finish goal 2",
                    Reward = "I will be the best at goal 2"
                },
                new Goal
                {
                    Title = "Goal 3",
                    Description = "Finish goal 3",
                    Reward = "I will be the best at goal 3"
                }
            };
            foreach (var goal in sprint.Goals)
            {
                goal.Milestones = new List<MyTask>
                {
                    new MyTask
                    {
                        Title = "First step",
                        Creator = creator,
                        EstimatedDate = sprint.StartDate.AddDays(16),
                        Status = Status.Planned,
                        IsMilestone = true
                    },
                    new MyTask
                    {
                        Title = "Second step",
                        Creator = creator,
                        EstimatedDate = sprint.StartDate.AddDays(32),
                        Status = Status.Planned,
                        IsMilestone = true
                    },
                    new MyTask
                    {
                        Title = "Third step",
                        Creator = creator,
                        EstimatedDate = sprint.StartDate.AddDays(47),
                        Status = Status.Planned,
                        IsMilestone = true
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
            var goalsToDelete = new List<Goal>();
            foreach (var stringId in sprintIds)
            {
                if (int.TryParse(stringId, out var id))
                {
                    sprintsToDelete.Add(_context.Sprints.First(s => s.SprintId.Equals(id)));
                    goalsToDelete.AddRange(_context.Goals.Where(g => g.SprintId == id));
                }
            }
            _context.RemoveRange(goalsToDelete);
            _context.RemoveRange(sprintsToDelete);
            _context.SaveChanges();
            return true;
        }
    }
}

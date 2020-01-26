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
            var sprints = _context.Sprints.Where(s => s.Creator.ToString() == currentUser).ToList();
            //for tests 
            if (!sprints.Any())
            {
                sprints.Add(new Sprint
                {
                    Creator = new Guid(currentUser),
                    SprintId = Guid.NewGuid(),
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(63),
                    Title = "Test sprint"
                });
            }
            return sprints;
        }

        [HttpGet]
        [Route("get/{sprintId}")]
        public Sprint Get(string sprintId)
        {
            return _context.Sprints.FirstOrDefault(s => s.SprintId.ToString() == sprintId);
        }

        [HttpPost]
        [Route("create")]
        public string Post(Sprint sprint)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            sprint.Creator = new Guid(currentUser);
            sprint.SprintId = Guid.NewGuid();
            sprint.StartDate = sprint.StartDate.ToUniversalTime();
            sprint.EndDate = sprint.EndDate.ToUniversalTime();
            _context.Sprints.Add(sprint);
            _context.SaveChanges();
            return sprint.SprintId.ToString();
        }

        [HttpPut]
        [Route("edit")]
        public Sprint Put(Sprint sprint)
        {
            var oldSprint = _context.Sprints.FirstOrDefault(s => s.SprintId == sprint.SprintId);
            if (oldSprint != null)
            {
                oldSprint.EndDate = sprint.EndDate;
                oldSprint.StartDate = sprint.StartDate;
                oldSprint.Title = sprint.Title;
                _context.SaveChanges();
            }

            return _context.Sprints.FirstOrDefault(s => s.SprintId == sprint.SprintId);
        }
    }
}

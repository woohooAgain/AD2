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
    [Route("task")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<MyTask> List()
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var tasks = _context.Tasks.Where(s => s.Creator.ToString() == currentUser);
            return tasks;
        }

        [HttpPost]
        [Route("changeState/{taskId}")]
        public string Post(string taskId)
        {
            var taskToComplete = _context.Tasks.First(t => t.MyTaskId.ToString().Equals(taskId));
            var currentState = taskToComplete.Completed;
            taskToComplete.Completed = !currentState;
            _context.SaveChanges();
            return taskId;
        }

        [HttpPut]
        [Route("edit")]
        public MyTask Put([FromBody]MyTask task)
        {
            _context.Update(task);
            _context.SaveChanges();
            return _context.Tasks.First(t => t.MyTaskId.Equals(task.MyTaskId));
        }

        [HttpPost]
        [Route("create")]
        public string Post([FromBody]MyTask task)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            task.MyTaskId = Guid.NewGuid();
            task.Creator = new Guid(currentUser);
            task.Completed = false;
            task.PlanDate = DateTime.Now;

            _context.Tasks.Add(task);
            _context.SaveChanges();
            return task.MyTaskId.ToString();
        }
    }
}

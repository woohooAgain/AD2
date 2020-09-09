using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AgileDiary2.Data;
using AgileDiary2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        [Route("listNearest")]
        public IEnumerable<MyTask> List()
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var tasks = _context.Tasks.Where(s => s.Creator.ToString() == currentUser);
            //Get tasks with plan date < this week end
            DateTime baseDate = DateTime.Today;
            var thisWeekStart = baseDate.AddDays(-(int)baseDate.DayOfWeek);
            var thisWeekEnd = thisWeekStart.AddDays(7).AddSeconds(-1);
            return tasks.Where(t => t.EstimatedDate < thisWeekEnd && !t.Completed);
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<MyTask> ListAll()
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _context.Tasks.Where(s => s.Creator.ToString() == currentUser);
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
            task.EstimatedDate = DateTime.Now.Date;

            _context.Tasks.Add(task);
            _context.SaveChanges();
            return task.MyTaskId.ToString();
        }

        [HttpDelete]
        [Route("delete")]
        public bool Delete([FromBody]string taskId)
        {
            var taskToDelete = _context.Tasks.First(s => s.MyTaskId.Equals(new Guid(taskId)));
            _context.Remove(taskToDelete);
            _context.SaveChanges();
            return true;
        }
    }
}

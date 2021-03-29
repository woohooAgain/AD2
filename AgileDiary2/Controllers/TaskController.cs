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
        [Route("get/{taskId}")]
        public MyTask Get(int taskId)
        {
            return _context.Tasks.FirstOrDefault(t => t.MyTaskId.Equals(taskId));
        }

        [HttpGet]
        [Route("listNearest/{sprintId}")]
        public IEnumerable<MyTask> List(int sprintId)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var guidUser = new Guid(currentUser);
            //var tasks = _context.Tasks.Where(s => s.Creator.ToString() == currentUser);
            //Get tasks with plan date < this week end
            DateTime baseDate = DateTime.Today;
            var thisWeekStart = baseDate.AddDays(-(int)baseDate.DayOfWeek);
            var thisWeekEnd = thisWeekStart.AddDays(7).AddSeconds(-1);
            var possibleGoals = _context.Goals.Where(g => g.SprintId.Equals(sprintId)).Select(g => g.GoalId).ToList();
            return _context.Tasks.Where(t => possibleGoals.Contains(t.GoalId) && t.EstimatedDate < thisWeekEnd && t.Status != Status.Finished && t.Creator == guidUser && !t.IsMilestone);
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<MyTask> ListAll()
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            //return _context.Tasks.Where(s => s.Creator.ToString() == currentUser);
            return new List<MyTask>();
        }

        [HttpPut]
        [Route("edit")]
        public MyTask Put([FromBody]MyTask task)
        {
            _context.Update(task);
            _context.SaveChanges();
            return _context.Tasks.First(t => t.MyTaskId.Equals(task.MyTaskId));
        }

        [HttpPut]
        [Route("complete/{taskId}")]
        public void Complete(int taskId)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.MyTaskId.Equals(taskId));
            if (task != null)
            {
                task.Status = Status.Finished;
                task.CompleteDate = DateTime.Now;
                _context.Update(task);
                _context.SaveChanges();
            }            
        }

        [HttpPost]
        [Route("create")]
        public string Post([FromBody]MyTask task)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            task.Creator = new Guid(currentUser);
            task.EstimatedDate = DateTime.Now.Date;
            task.Status = Status.Planned;
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return task.MyTaskId.ToString();
        }

        [HttpDelete]
        [Route("delete/{taskId}")]
        public bool Delete(int taskId)
        {
            var taskToDelete = _context.Tasks.First(s => s.MyTaskId.Equals(taskId));
            _context.Remove(taskToDelete);
            _context.SaveChanges();
            return true;
        }
    }
}

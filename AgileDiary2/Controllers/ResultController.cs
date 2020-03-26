using System;
using System.Collections.Generic;
using System.Linq;
using AgileDiary2.Data;
using AgileDiary2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgileDiary2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("result")]
    public class ResultController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResultController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("/get/{resultId}")]
        public Result Get(string resultId)
        {
            return _context.Result.First(r => r.ResultId.ToString().Equals(resultId));
        }

        [HttpGet]
        [Route("/getForDate/{resultId}")]
        public Result GetForDate(string stringDate)
        {
            DateTime.TryParse(stringDate, out var date);
            return _context.Result.First(r => IsSameDate(r.Date, date));
        }

        private bool IsSameDate(DateTime? rDate, in DateTime date)
        {
            return rDate.HasValue &&
                   rDate.Value.Date.Equals(date.Date);
        }

        [HttpGet]
        [Route("/getForSprint/{sprintId}")]
        public IEnumerable<Result> GetForSprint(string sprintId)
        {
            return _context.Result.Where(r => r.SprintId.ToString().Equals(sprintId));
        }

        [HttpPost]
        [Route("/create")]
        public Guid Create([FromBody] Result result)
        {
            result.ResultId = Guid.NewGuid();
            _context.Result.Add(result);
            _context.SaveChanges();
            return result.ResultId;
        }
    }
}

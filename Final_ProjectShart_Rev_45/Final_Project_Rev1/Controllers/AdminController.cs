using Final_Project_Rev1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.TaskScheduler;
using System.Diagnostics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Final_Project_Rev1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        // GET: api/<AdminController>
        [HttpGet]
        public int Get()
        {
            Admin admin = new Admin();
            return admin.CountUsers();
        }

        // GET api/<AdminController>/5
        [HttpGet("{id}")]
        public List<object> GetMatch(int id)
        {
            Admin admin = new Admin();
            return admin.CountMatchReq(id);
           
        }

        // GET api/<AdminController>/5
        [HttpGet("{id}/{month}")]
        public List<object> GetHoursCounter(int id, int month)
        {
            Admin admin = new Admin();
            return admin.CountHours(id, month);

        }

        // GET api/<AdminController>/5
        [HttpGet("/count/borrow")]
        public int GetCountBorrow()
        {
            Admin admin = new Admin();
            return admin.CountBorrow();

        }


        // GET api/<AdminController>/5
        [HttpGet("/count/request/Admin")]
        public int GetCountrequest()
        {
            Admin admin = new Admin();
            return admin.CountRequest();

        }
        // GET api/<AdminController>/5
        [HttpGet("/count/request/Admin/Match")]
        public int GetCountMatch()
        {
            Admin admin = new Admin();
            return admin.CountMatch();

        }

        // GET api/<AdminController>/5
        [HttpGet("/adress")]
        public List<object> GetAdress()//הוצאת הבניינים לאדמין
        {
            Admin admin = new Admin();
            return admin.GetBuilding();

        }

        [HttpGet("/ReadResultsOfTheSurvey/QuestionNumber/{Qnumber}/quarter/{quarter}/year/{year}")]
        public int[] GetResultsOfTheSurvey(int Qnumber, int quarter, int year)//הוצאת הבניינים לאדמין
        {
            Admin admin = new Admin();
            return admin.ReadResultsOfTheSurvey(Qnumber, quarter, year);

        }

        [HttpGet("/ReadCountUsersByCoinsRange/idBuilding/{idBuilding}")]
        public int[] GetCountUsersByCoinsRange(int idBuilding)//שליפת מספר מטבעות שנותר לדיירים לפי מספר בניין
        {
            Admin admin = new Admin();
            return admin.ReadCountUsersByCoinsRange(idBuilding);

        }

        [HttpPost]
        [Route("register-task")]
        public IActionResult RegisterTask()
        {
            TaskService ts = new TaskService();
            TaskDefinition td = ts.NewTask();
            td.RegistrationInfo.Description = "My scheduled task";

            // Set up the trigger to run every minute
            td.Triggers.Add(new TimeTrigger
            {
                StartBoundary = DateTime.Now,
                Repetition = new RepetitionPattern(TimeSpan.FromMinutes(1), TimeSpan.Zero),
                Enabled = true
            });
            Admin admin = new Admin();
           

            // Set up the action to run your scheduled task
            td.Actions.Add(new ExecAction("C:\\Users\\naama\\Desktop\\Final_Project_Rev38\\Final_ProjectShart_Rev38\\Final_Project_Rev1\\bin\\Debug\\net6.0\\Final_Project_Rev1.exe","Run"));

            // Register the task with the Task Scheduler
            ts.RootFolder.RegisterTaskDefinition("MyTask", td);

            return Ok();
        }

        
        // POST api/<AdminController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // DELETE api/<AdminController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
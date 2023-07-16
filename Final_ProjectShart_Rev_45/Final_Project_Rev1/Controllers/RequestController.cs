using Final_Project_Rev1.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Final_Project_Rev1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        // GET: api/<RequestController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<RequestController>/5
        [HttpGet("GetRequest/{email}")]  //שליפת כל הבקשות של המשתמש לפי מייל באזור האישי
        public List<object> Get(string email)  //שליפת הבקשות של המשתמש לפי מייל
        {
            Request req = new Request();
            return req.GetMyRequest(email);
        }

        [HttpGet("GetAllRequests/{email}")]  //שליפת כל הבקשות של הבניין שלי
        public List<object> GetAllRequests(string email)
        {

            Request req = new Request();
            return req.ReadRequests(email);
        }

        //eden
        [HttpGet("CheckingRequestBeforInsert")]//בדיקה שאותו הדייר לא מבקש שוב פעם לאותה החניה את אותן השעות
        public int CheckingRequestBeforInsert(int idBorrow, string email_request, DateTime startDate, DateTime endDate, DateTime startTime, DateTime endTime)//הכנסת בקשה
        {
            Request request = new Request();
            int ANS = request.CheckingRequestBeforInsert(idBorrow, email_request, startDate, endDate, startTime, endTime);
            return ANS;//מחזיר את מספר הבקשה שכבר קיים בשעות הללו לחניה הזאת
        }
        //eden

        // POST api/<RequestController>
        [HttpPost]
        public int Post([FromBody] Request request)//הכנסת בקשה
        {
            int ANS = request.InsertRequestU();
            return ANS;//מחזיר את מספר הבקשה
        }

        // PUT api/<RequestController>/5
        [HttpPut("updateRequestForBorrow")] //אישור בקשה להשאלה מטבלת מזמינים
        public IActionResult Put([FromBody] JsonElement data)
        {
            Request request = new Request();
            int idBorrow = Convert.ToInt32(data.GetProperty("IdBorrow").GetString()); //שליפת השדות של האוביקט שנשלח מצד לקוח
            int idRequest = Convert.ToInt32(data.GetProperty("IdRequest").GetString());
            int ANS;
            try
            {
                ANS = request.UpdateReqForBorrow(idBorrow, idRequest);  //בדיקה שאפשר לאשר את הבקשה ואינה מתנגשת עם בקשות אחרות
            }
            catch
            {
                return StatusCode(500, "The server could not Update the Request");
            }

            if (ANS >= 0)  //במידה והצליח להכניס לטבלה
            {
                return Ok(ANS);
            }
            else
            {
                return NotFound();
            }
        }

        // PUT api/<RequestController>/5
        [HttpPut("updateRequestcancealedForBorrow")]  //ביטול בקשה להשאלה מטבלת מזמינים
        public IActionResult PutCancealed([FromBody] JsonElement data)
        {
            Request request = new Request();
            int idBorrow = Convert.ToInt32(data.GetProperty("IdBorrow").GetString()); //שליפת השדות של האוביקט שנשלח מצד לקוח
            int idRequest = Convert.ToInt32(data.GetProperty("IdRequest").GetString());
            int ANS = request.UpdateCancealedForBorrow( idBorrow,idRequest,0);  //עכדון טבלת מאץ
            if (ANS >= 0)  //במידה והצליח להכניס לטבלה
            {
                return Ok(ANS);
            }
            else
            {
                return NotFound();
            }
        }

        // PUT api/<RequestController>/5
        [HttpPut("updateRequestHours")]  //עדכון שעות בקשה של משתמש
        public IActionResult PutUpdateHours([FromBody] Request request)
        {
            int ANS = request.UpdateRequest(); 
            if (ANS >= 0)  //במידה והצליח לעדכן
            {
                return Ok(ANS);
            }
            else
            {
                return NotFound();
            }
        }

        // DELETE api/<RequestController>/5
        [HttpDelete("Id/{idRequest}")]
        public IActionResult Delete(int idRequest)  //מחיקת בקשה של המשתמש
        {
            Request req = new Request();    
            int ANS = req.DeleteRequest(idRequest);
            if (ANS == 1)  
            {
                return Ok(ANS);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost ("/ApproveRequest/{idrequest}")]
        public int Post([FromBody] Borrow borrow , int idrequest)// אישור עזרה לשכן
        {
            Request request= new Request();
            int ANS = request.CheckToApproveRequest(borrow, idrequest);
            return ANS; 
        }

        [HttpGet("GetRequestForGeneralBorrow")]  //שליפת הבקשות של המשתמש לפי מייל בשביל השאלה ספציפית- דף כללי
        public List<object> GetRequestForGeneralBorrow(int BorrowId, string emailRequest)
        {

            Request req = new Request();
            return req.GetRequestForGeneralBorrow(BorrowId, emailRequest);
        }
    }
}

using Final_Project_Rev1.Models;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Final_Project_Rev1.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        // GET: api/<ValuesController>
        [HttpGet("{Email}")] //התחברות לפי מייל
        public IActionResult Get(string Email)
        {
            User u = new User();
            User u1 = u.login(Email);
            if (u1.Email == null)
            {
                return NotFound();
            }
            else return Ok(u1);
        }

        [HttpGet("{mail}/getPhones")] //הוצאת הטלפונים של המשתמש
        public List<string> GetPhones(string mail)
        {
            User u = new User();
           return u.ReadUserPhones(mail);
        }

        [HttpGet("{idbuilding}/getPhones/users")] //הוצאת הטלפונים של המשתמש
        public List<object> GetPhones(int idbuilding)
        {
            User u = new User();
            return u.GetPhones(idbuilding);
        }

        [HttpGet("AnswerTheQuarterlySurvey/{email}")] //בדיקה אם הדייר כבר ענה הסקר הרבעון והשנה הנוחכית
        public int AnswerTheQuarterlySurvey(string email)
        {
            User u = new User();
            return u.AnswerTheQuarterlySurvey(email);
        }

        [HttpGet("CurrentNumberOfCoins/{email}")] //שליפה כמות המטבעות והבקשות שיש למשתמש כרגע
        public object CurrentNumberOfCoins(string email)
        {
            User u = new User();
            return u.CurrentNumberOfCoins(email);
        }


        [HttpPost("InsertSurvey")] //הכנסת תשובות הדייר לסקר לבסיס הנתונים
        public int InsertSurvey([FromBody] JsonElement data)
        {
            User u = new User();
            return u.InsertSurvey(data);
        }

        //POST api/<ValuesController>
        [HttpPost]
        public int Post([FromBody] User user, string Codebuilding)//רישום משתמש
        {
            try
            {
                return user.InsertUser(user, Codebuilding);
            }
            catch (Exception ex)//אם לא הצליח יחזיר -1 למשתמש
            {
                // write to log
                Console.WriteLine(ex.Message);
               
                return -1;
            }
        }

        //POST api/<ValuesController>
        [HttpGet("SendPAS/ToUser/{mail}")]
        public int GETPhones(string mail)//רישום משתמש
        {
            User u = new User();
            try
            {
                return u.GetPassword(mail);
            }
            catch (Exception ex)//אם לא הצליח יחזיר -1 למשתמש
            {
                // write to log
                Console.WriteLine(ex.Message);

                return -1;
            }
        }


        [HttpPost("/Parking")]
        public int PostParking(JsonElement data)//הכנסת חניה לטבלת חניות
        {
            User u = new User();
            string Parking1 = data.GetProperty("Parking1").GetString();
            string Parking2 = data.GetProperty("Parking2").GetString();
            string Parking3 = data.GetProperty("Parking3").GetString();
            string Parking4 = data.GetProperty("Parking4").GetString();
            string Email = data.GetProperty("Email").GetString();
            string BuildingCode= data.GetProperty("BuildingCode").GetString();
            string[] parkingSpots = {Parking1, Parking2, Parking3, Parking4 };     //יצירת מערך של החניות 
            return u.insertParking(parkingSpots, Email, BuildingCode);
        }

        [HttpPost("Phone")]
        public int PostPhone(JsonElement data)//הכנסת טלפון לטבלת טלפונים
        {
            User u = new User();
            string Phone1 = data.GetProperty("Phone1").GetString();
            string Phone2 = data.GetProperty("Phone2").GetString();
            string Email = data.GetProperty("Email").GetString();
            string[] phoneNum = { Phone1, Phone2}; //יצירת מערך טלפונים
            return u.insertPhone(phoneNum, Email);
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpPut("UPDATE/user/details")]
        public IActionResult PUT ([FromBody] JsonElement data) //עדכון פרטי השאלה
        {
            User u = new User();
            int ANS;
            ANS=u.Update(data); 
            if (ANS >= 1)  //במידה והצליח להכניס יום בודד או טווח
            {
                return Ok(ANS);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPut("UPDATE/coins")]
        public int PUT() //עדכון מטבעות של המשתמשים
        {
            User u = new User();
            return u.TransferCoins();
           
        }

    }
}

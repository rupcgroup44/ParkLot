using Final_Project_Rev1.Models.DAL;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.TaskScheduler;

namespace Final_Project_Rev1.Models
{
    public class Admin
    {
        public int CountUsers() //כמה משתמשים רשומים
        {
            DBservices dbs = new DBservices();
            return dbs.CountUsers();
        }
        public int CountBorrow() //כמה השאלות היו
        {
            DBservices dbs = new DBservices();
            return dbs.CountBorrows();
        }
        public int CountRequest() //כמה בקשות היו
        {
            DBservices dbs = new DBservices();
            return dbs.CountRequests();
        }
        public int CountMatch() //כמה מאצים היו
        {
            DBservices dbs = new DBservices();
            return dbs.CountMatch();
        }
        public List<object> CountMatchReq(int id) //כמה בקשות נענו 
        {
            DBservices dbs = new DBservices();
            return dbs.GetMatchCount(id);
        }
        public List<object> CountHours(int id, int month) //באילו שעות יש בקשות 
        {
            DBservices dbs = new DBservices();
            return dbs.GetHoursCount(id, month);
        }
        public List<object> GetBuilding() //מוציא בניין וכתובת 
        {
            DBservices dbs = new DBservices();
            return dbs.GetBuildingList();
        }

        public int[] ReadResultsOfTheSurvey(int Qnumber, int quarter, int year) //שליפת תוצאות הסקר לפי בניין רבעון ושנה  
        {
            DBservices dbs = new DBservices();
            return dbs.ReadResultsOfTheSurvey(Qnumber, quarter, year);
        }

        public int[] ReadCountUsersByCoinsRange(int idBuilding) //שליפת מספר מטבעות שנותר לדיירים לפי מספר בניין
        {
            DBservices dbs = new DBservices();
            return dbs.ReadCountUsersByCoinsRange(idBuilding);
        }

        public int Run()
        {
            Console.WriteLine("MyScheduledTask ran at3 " + DateTime.Now);
            DBservices dbs = new DBservices();
           return dbs.TEST();
           
        }

        //public static void Run()
        //{
        //    Admin admin = new Admin();
        //    int userCount = admin.CountUsers();
        //    Console.WriteLine("Number of registered users: " + userCount);
        //}






    }
}
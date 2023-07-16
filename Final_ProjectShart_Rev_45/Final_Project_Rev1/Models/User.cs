using Final_Project_Rev1.Models.DAL;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Final_Project_Rev1.Models
{
    public class User
    {
        string email;
        string firstName;
        string familyName;
        string city;
        string street;
        string password;
        int coins;
        int idBuilding;
        string buildingCode;
        int buildingNumber;
        int Rate;
        public string Email { get => email; set => email = value; }
        public string FirstName { get => firstName; set => firstName = value; }
        public string FamilyName { get => familyName; set => familyName = value; }
        public string City { get => city; set => city = value; }
        public string Street { get => street; set => street = value; }
        public string Password { get => password; set => password = value; }
        public int Coins { get => coins; set => coins = value; }
        public int IdBuilding { get => idBuilding; set => idBuilding = value; }
        public string BuildingCode { get => buildingCode; set => buildingCode = value; }
        public int BuildingNumber { get => buildingNumber; set => buildingNumber = value; }
        public int Rate1 { get => Rate; set => Rate = value; }

        public User login(string email)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadUser(email);
        }

        public int InsertUser(User user, string building_code)   
        {

            DBservices dbs = new DBservices();
            int idBuild= dbs.ReadByAddress(user.city,user.street, user.buildingNumber);

            if(idBuild!=0)//אם קיים בניין כזה
            {
            return dbs.InsertUser(user, idBuild);//תכניס לי את המשתמש
            }
            else//אם לא קיים בניין
            {
                dbs.InsertBuilding(building_code);//הכנסת בניין חדש
                int id=dbs.ReadBuildingId(building_code);//קבלת ה-ID  של הבניין החדש
                return dbs.InsertUser(user,id);//הכנסת יוזר חדש עם בניין 
            } 

        }

        public int insertParking(string[] parkingSpots, string Email,string building_code)
        {
            DBservices dbs = new DBservices();
            int BuildingId = dbs.ReadBuildingId(building_code); // הוצאה מספר בניין שאני שייך 
            int CheckedParkingName;
            for (int i = 0; i < parkingSpots.Length-1;i++) {//ריצה על החניות שאני רוצה להכניס
                if (parkingSpots[i]!= null) //כל עוד יש לי במערך שם חניה
                {
                    CheckedParkingName = dbs.GetcheckParkingName(BuildingId, parkingSpots[i]); //בדיקה האם שם חניה ספציפי כבר קיים בבניין
                    if (CheckedParkingName == 1) // לא קיים שם חניה בבניין
                    {
                        int ANS = dbs.DeleteUser(Email);//מוחק את המשתמש
                        if (ANS == 1)//הצליח למחוק את המשתמש
                        { return 0; }
                    }
                } 
            }
            return dbs.InsertParking(parkingSpots, Email); // הוספה לטבלה של חניות עם שמות חניות תקינות 
        }
       
        public int insertPhone(string[] phoneNum, string email)
        {
            DBservices dbs = new DBservices();
            return dbs.InsertPhoneNumber(phoneNum, email);

        }

        public List<string> ReadUserPhones(string mail)//הוצאת הטלפונים של המשתמש
        {
            DBservices dbs = new DBservices();
            return dbs.GetUserPhone(mail);

        }

        public int Update(JsonElement data)//עדכון פרטי משתמש בפרופיל
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateUserDetails(data);

        }

        public List<object> GetPhones(int idbuilding)//הוצאת טלפונים של כל המשתמשים בבניין
        {
            DBservices dbs = new DBservices();
            return dbs.ReadPhones(idbuilding);
           
        }
        public int GetPassword(string mail)//הוצאת סיסמא של המשתמש
        {
            DBservices dbs = new DBservices();
            
           string ANS= dbs.GetPassword(mail);
            if (ANS!="")
            {
                Email E = new Email();
                E.PasswordUser(mail,ANS);
                return 1;//שליחת מייל למשתמש המבקש שההשאלה בוטלה
            }
            else
            {
                return 0;
            }
        }
        public int InsertSurvey(JsonElement data) //הכנסת תשובות הדייר לסקר לבסיס הנתונים
        {
            DBservices dbs = new DBservices();
            string email=data.GetProperty("email").GetString();
            int num=dbs.UpdateCoins(email);
            return dbs.InsertSurvey(data);
        }
        public int AnswerTheQuarterlySurvey(string email)//בדיקה אם הדייר כבר ענה הסקר הרבעון והשנה הנוחכית
        {
            DBservices dbs = new DBservices();
            return dbs.AnswerTheQuarterlySurvey(email);
        }
        public int TransferCoins()//העברת מטבעות בין הדיירים להשאלות שעברו 
        {
            DBservices dbs = new DBservices();
            return dbs.TransferringCoins();
        }

        public object CurrentNumberOfCoins(string email) // שליפה כמות המטבעות למשתמש כרגע
        {
            DBservices dbs = new DBservices();
            return dbs.CurrentNumberOfCoins(email);

        }
    }    
        

    
}
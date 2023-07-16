using Final_Project_Rev1.Models.DAL;
namespace Final_Project_Rev1.Models
{
    public class Request
    {
        int id;
        DateTime startDate;
        DateTime endDate;
        DateTime startTime;
        DateTime endTime;
        int status;
        string email;

        private dynamic selectedMatch;
        private DateTime selectedMatchET;
        private DateTime selectedMatchST;

        public int Id { get => id; set => id = value; }
        public DateTime StartDate { get => startDate; set => startDate = value; }
        public DateTime EndDate { get => endDate; set => endDate = value; }
        public DateTime StartTime { get => startTime; set => startTime = value; }
        public DateTime EndTime { get => endTime; set => endTime = value; }
        public int Status { get => status; set => status = value; }
        public string Email { get => email; set => email = value; }


        public int InsertRequestU() //הכנסת בקשה לדף הכללי של הבקשות
        {
            DBservices dbs = new DBservices();
            return dbs.InsertRequest(this);
        }

        public List<object> GetMyRequest(string email)  //שליפת הבקשות של המשתמש לפי מייל
        {
            DBservices dbbs = new DBservices();
            return dbbs.getRequestByEmail(email);
        }

        public int UpdateRequest()  //עדכון שעות בקשה של משתמש
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateRequest(this);
        }

        //בדיקה שאותו הדייר לא מבקש שוב פעם לאותה החניה את אותן השעות
        public int CheckingRequestBeforInsert(int idBorrow, string email_request, DateTime startDate, DateTime endDate, DateTime startTime, DateTime endTime) //בדיקת בקשה לפני הכנסה לבסיס נתונים
        {
            DBservices dbs = new DBservices();
            return dbs.CheckingRequest(idBorrow, email_request, startDate, endDate, startTime, endTime);
        }

        public int UpdateReqForBorrow(int idBorrow,int idRequest) //אישור בקשה להשאלה במידה וניתן
        {
            Borrow borrow = new Borrow();   
            List<object> CheckMatch = borrow.GetMatchFromDB(idBorrow);//מוציאה את כל המאצים שיש להשאלה
            for (int i = 0; i < CheckMatch.Count; i++)
            {
                var lookMatch = (dynamic)CheckMatch[i]; // המרה לאוביקט דינמי על מנת שנוכל לגשת לשדות
                if (lookMatch.RequestId== idRequest) //חיפוש הבקשה שרצו לאשר
                {
                    selectedMatch= lookMatch; //שמירת הבקשה שרצו לאשר
                    selectedMatchST = lookMatch.RequestStartDate.Date + lookMatch.RequestStartTime.TimeOfDay; //שמירת זמן התחלה בפורמט מתאים להשוואה
                    selectedMatchET = lookMatch.RequestEndDate.Date + lookMatch.RequestEndTime.TimeOfDay;  //שמירת זמן סיום בפורמט מתאים להשוואה
                }
            }
            if (CheckMatch != null) //במידה ויש מאציצים
            {
                List<object> ConfirmedMatch = new List<object>();
                for (int i = 0; i < CheckMatch.Count; i++)//מי מהם אושר
                {
                    var match = (dynamic)CheckMatch[i]; // המרה לאוביקט דינמי על מנת שנוכל לגשת לשדות
                    if (match.status==1) //סטטוס של המאצים
                    {
                        ConfirmedMatch.Add(match);  //מכניסה לרשימה חדשה של מאושרים בלבד
                    }
                }
                if (ConfirmedMatch != null) //אם הרשימה לא ריקה
                {
                    //בדיקה האם יש מקום לבקשה שרצו לאשר בהשאלה
                    for (int i = 0; i < ConfirmedMatch.Count; i++)
                    {
                        var match = (dynamic)ConfirmedMatch[i];
                        DateTime reqST = match.RequestStartDate.Date + match.RequestStartTime.TimeOfDay; //שמירת זמן התחלה בפורמט מתאים להשוואה
                        DateTime reqET = match.RequestEndDate.Date + match.RequestEndTime.TimeOfDay;  //שמירת זמן סיום בפורמט מתאים להשוואה
                        if (selectedMatchST < reqET && selectedMatchET > reqST)  //עובד גם ברגיל גם משמרת לילה
                        {
                            return 0; //אי אפשר להכניס אותו הוא חופף עם בקשות אחרות
                        }
                    }
                }else return UpdateUser(idBorrow, idRequest, selectedMatch, 1); //ניתן לאשר את הבקשה לכן
            }
            else //במידה ואין לו מאצים כלומר הוא פנוי לגמרי
            {
                return UpdateUser(idBorrow, idRequest, selectedMatch, 1); //ניתן לאשר את הבקשה לכן
            }
            return UpdateUser(idBorrow, idRequest, selectedMatch, 1); //ניתן לאשר את הבקשה לכן
        }

        public int UpdateCancealedForBorrow(int idBorrow, int idRequest, int status)
        {
            Borrow borrow = new Borrow();  //בשביל שליחת המייל
            List<object> CheckMatch = borrow.GetMatchFromDB(idBorrow);//מוציאה את כל המאצים שיש להשאלה
            for (int i = 0; i < CheckMatch.Count; i++)
            {
                var lookMatch = (dynamic)CheckMatch[i]; // המרה לאוביקט דינמי על מנת שנוכל לגשת לשדות
                if (lookMatch.RequestId == idRequest) //חיפוש הבקשה שרצו לבטל
                {
                    selectedMatch = lookMatch; //שמירת הבקשה שרצו לבטל
                }
            }
            return UpdateUser(idBorrow, idRequest, selectedMatch, status); //שליחה לשם עדכון הטבלאות ושליחת המייל
        }

        public int UpdateUser(int idBorrow,int idRequest, object selectedMatch, int status) //עדכון בקשה וגם טבלת מאץ ושליחת מייל
        {
            DBservices DBreq = new DBservices();
            DBreq.UpdateAsk_forStatus(idBorrow, idRequest, status); //נעדכן טבלת מאצים שהסטטוס אחד
            DBservices dbsupdate = new DBservices();
            Email E = new Email();
            if (status == 1)
            {
                E.updateRequestApproved(selectedMatch);  //שליחת מייל למבקש שהבקשה התקבלה
            }
            else E.deleteEmail(selectedMatch);
            return dbsupdate.UpdateRequestStatus(idRequest, status); //מעדכנים בקשה לסטטוס אחד;
        }

        public int DeleteRequest(int idRequest)  //מחיקת בקשה מבסיס הנתונים
        {
            DBservices dbs = new DBservices();
            List<object> CheckMatchs = dbs.GetMatchByRequest(idRequest);//מוציאה את כל המאצים שיש להשאלה
            if (CheckMatchs.Count>0)  //במידה ויש מאצים
            {
                for (int i = 0; i < CheckMatchs.Count; i++)
                {
                    var lookMatch = (dynamic)CheckMatchs[i];
                    if (lookMatch.status == 1) { //אם הבקשה כבר אושרה
                        Email email= new Email();
                        email.DeleteRequest(lookMatch); //שליחת מייל למשאיל שבקשה שאישר בוטלה
                    }
                    dbs.DeleteMatch(lookMatch.BorrowId, lookMatch.RequestId);  //מחיקת מאץ מהטבלה
                }
            }
            return dbs.DeleteRequestInData(idRequest);  //מחיקת הבקשה מבסיס הנתונים
            
        }

        public List<object> ReadRequests(string email) // קיראה כל הבקשות שלא אושרו לדף הכללי 
        {
            DBservices dbs = new DBservices();
            int idBuilding = dbs.GetBuildingIDAccordingEmail(email);
            return dbs.ReadRequests(idBuilding, email);
        }

        public int CheckToApproveRequest(Borrow borrow, int idrequest) //אישור עזרה לשכן-בדיקה 
        {
            DBservices dbs = new DBservices();
            int idBorrow;
            idBorrow = dbs.CheckingBorrowExist(borrow.Email, borrow.StartDate, borrow.EndDate, borrow.StartTime, borrow.EndTime, borrow.ParkingName);//בדיקה האם ההשאלה קיימת
            if (idBorrow == 0) // ההשאלה לא קיימת לכן ניצור חדש
            {
                dbs.InsertBorrow(borrow); // הכנסת השאלה חדשה
                idBorrow = dbs.CheckingBorrowExist(borrow.Email, borrow.StartDate, borrow.EndDate, borrow.StartTime, borrow.EndTime, borrow.ParkingName); // שליפה מספר השאלה לאחר יצירת השאלה חדשה
                dbs.InsertToAsk_for(idBorrow, idrequest); // הכנסת מאץ
                dbs.UpdateBorrows(idBorrow, 1); // עדכון סטטוס השאלה למלא
            }
            return UpdateReqForBorrow(idBorrow, idrequest); // בדיקה האם אפשר לאשר בקשה להשאלה

        }


        public List<object> GetRequestForGeneralBorrow(int BorrowId, string emailRequest)  //שליפת הבקשות של המשתמש לפי מייל בשביל השאלה ספציפית- דף כללי
        {
            DBservices dbs = new DBservices();
            return dbs.GetRequestForGeneralBorrow(BorrowId, emailRequest);

        }
    

}
}

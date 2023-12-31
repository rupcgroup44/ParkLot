﻿
$(document).ready(function () {
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/Borrow/";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/Borrow/";
    }

    userData = JSON.parse(sessionStorage.getItem("userLogin"));
    email = userData.email;

    ajaxCall("GET", api + "User/" + email, "", getMyBorrowsSCB, getMyBorrowsECB);

    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        url = "https://localhost:7006/api/Request/";
    } else {
        url = "https://proj.ruppin.ac.il/cgroup44/prod/api/Request/";
    }

    ajaxCall("GET", url + "GetRequest/" + email, "", getMyRequestSCB, getMyRequestECB);

    $('#myModal').on('hidden.bs.modal', function () { //הודעה קופצת
        if ($('#title').text() == 'הצלחה') {
            window.location = "PersonalArea.html";
        }
    });

    // Get the modal
    var modal = document.getElementById("myModalPopup");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Add a global click event listener to the document
    document.addEventListener('click', function (event) {
        // Check if the clicked element has the "close" class
        if (event.target.classList.contains('close')) {
            modal.style.display = "none";
        }
    });

    const borrowsTab = document.getElementById('borrowsTab');
    const ordersTab = document.getElementById('ordersTab');
    const borrowsDiv = document.getElementById('borrowsDiv');
    const ordersDiv = document.getElementById('ordersDiv');

    borrowsTab.addEventListener('click', () => {
        borrowsDiv.style.display = 'block';
        ordersDiv.style.display = 'none';
    });

    ordersTab.addEventListener('click', () => {
        ordersDiv.style.display = 'block';
        borrowsDiv.style.display = 'none';
    });
    
});

function getMyRequestSCB(data) { //במידה וקיימות לי בקשות
    console.log(data);
    if (data.length >= 1) {
        renderMyRequest(data); //הצגה בדף
    } else {
        getMyRequestECB(data);
    }
}

function getMyRequestECB(erorr) {  //במידה ולא קיימות לי בקשות
    console.log(erorr);
    str = "<div class='gtco-container justify-content-center frame BorrowShow4'>";
    str += "<p> <strong>לא קיימות בקשות</p></div > ";
    document.getElementById("showMyOrders").innerHTML = str;
}

function getMyBorrowsSCB(data) {  //שולף את כל ההשאלות שלי
    console.log(data);
    if (data.length >= 1) {
        renderMyBorrows(data); //הצגה בדף
    } else {
        getMyBorrowsECB(data);
    }
}

function getMyBorrowsECB(erorr) { //במידה ולא קיימות לי השאלות
    console.log(erorr);
    str = "<div class='gtco-container justify-content-center frame BorrowShow4'>";
    str += "<p> <strong>לא קיימות השאלות</p></div > ";
    document.getElementById("showMyBorrows").innerHTML = str;
}

function renderMyBorrows(data) { //הצגת כל ההשאלות שלי
    var str = "";
    sessionStorage.setItem("borrows", JSON.stringify(data));  //שמירה באחסון מקומי
    for (let i = 0; i < data.length; i++) {
        dateStart = covertDate(data[i].startDate);
        dateEnd = covertDate(data[i].endDate);
        const isoString = data[i].startTime;
        const timeStringStart = isoString.slice(11, 16); // output: "10:30"
        const isoString2 = data[i].endTime
        const timeStringEnd = isoString2.slice(11, 16); // output: "10:30"
        if (data[i].status == 0) {
            status = "פנוי לבקשות נוספות"
        }
        else status = "מושאל"
        str += "<div class='col-xs-4 gtco-container justify-content-center frame BorrowShow3 dir_col'>";
        str += " <p> <strong>מספר השאלה:</strong> " + data[i].id + "</p>";
        str += " <p> <strong>שם חניה:</strong> " + data[i].parkingName + "</p>";
        str += " <p> <strong>תאריך התחלה:</strong>  " + dateStart + "</p>";
        str += " <p> <strong>תאריך סיום:</strong> " + dateEnd + "</p>";
        str += " <p> <strong>שעת התחלה:</strong> " + timeStringStart + "</p>";
        str += " <p> <strong>שעת סיום:</strong> " + timeStringEnd + "</p>";
        str += " <p> <strong>סטטוס:</strong> " + status + "</p>";
        str += "<p> <strong>ניצולת:</strong></p>";
        str += `<progress max="100" value="${data[i].utilization}"></progress>${data[i].utilization}%`;
        str += "<br>";
        str += `<button value="פרטים" id="${data[i].id}" onclick="GetDetails(this.id)" class="btn btn-primary btn-middle">פרטים</button>`;
        str += "</div>";
    }
    document.getElementById("showMyBorrows").innerHTML = str;
}

function renderMyRequest(data) { //הצגת כל הבקשות שלי
    var str = "";
    sessionStorage.setItem("Request", JSON.stringify(data)); //שמירה באחסון מקומי
    for (let i = 0; i < data.length; i++) {
        dateStart = covertDate(data[i].requestStartDate);
        dateEnd = covertDate(data[i].requestEndDate);
        const isoString = data[i].requestStartTime;
        const timeStringStart = isoString.slice(11, 16); // output: "10:30"
        const isoString2 = data[i].requestEndTime
        const timeStringEnd = isoString2.slice(11, 16); // output: "10:30"
        if (data[i].requestStatus == 0) {
            status = "בקשה בהמתנה"
        }
        else status = "בקשה אושרה"
        str += "<div class='col-xs-4 gtco-container justify-content-center frame BorrowShow3 dir_col'>";
        str += " <p> <strong>מספר בקשה:</strong> " + data[i].requestId + "</p>";
        str += " <p> <strong>תאריך התחלה:</strong>  " + dateStart + "</p>";
        str += " <p> <strong>תאריך סיום:</strong> " + dateEnd + "</p>";
        str += " <p> <strong>שעת התחלה:</strong> " + timeStringStart + "</p>";
        str += " <p> <strong>שעת סיום:</strong> " + timeStringEnd + "</p>";
        str += " <p> <strong>סטטוס:</strong> " + status + "</p>";
        str += `<button value="פרטים" id="${data[i].requestId}" onclick="GetDetailsRequest(this.id)" class="btn btn-primary btn-middle">פרטים</button>`;
        str += "</div>";
    }
    document.getElementById("showMyOrders").innerHTML = str;
}

function GetDetailsRequest(idRequest) {  //לאחר לחיצה פתור לפרטים על בקשה 
    var Requests = JSON.parse(sessionStorage.getItem("Request")); //שולפת מהאחסון את כל הבקשות
    for (var i = 0; i < Requests.length; i++) { //מחפשת את הבקשה שלחצו עליה
        if (Requests[i].requestId == idRequest) {
            Request = Requests[i];
        }
    }
    $("#myModalPopup").css({ "display": "block" });
    dateStart = covertDate(Request.requestStartDate);
    dateEnd = covertDate(Request.requestEndDate);
    const isoString = Request.requestStartTime;
    const timeStringStart = isoString.slice(11, 16); // output: "10:30"
    const isoString2 = Request.requestEndTime
    const timeStringEnd = isoString2.slice(11, 16); // output: "10:30"
    if (Request.requestStatus == 0) {  //בקשה עדיין לא אושרה
        status = "בקשה בהמתנה"
    }
    else status = "בקשה אושרה"
    var str = "";
    str += "<div class='modal-content-Popup'>";
    str += "<div class='close'>X</div>";
    str += `<h1><strong>מספר בקשה: </strong>${Request.requestId}</h1>`;
    str += `<p><strong>תאריך התחלה:</strong> ${dateStart}</p>`;
    str += `<p><strong>תאריך סיום:</strong> ${dateEnd}</p>`;
    str += `<div id="showHours">`;
    str += `<p><strong>שעת התחלה:</strong> ${timeStringStart}</p>`;
    str += `<p><strong>שעת סיום:</strong> ${timeStringEnd}</p>`;
    str += `</div>`;
    str += `<div class="row" id="hoursUpdate">`;
    str += `<div class="col-xs-6">`;
    str += ` <label for="end-time">שעת סיום:</label>`;
    str += ` <input type="time" id="end-time" name="end-time" class="form-control" value="${timeStringEnd}"/>`;
    str += `</div>`;
    str += `<div class="col-xs-6">`;
    str += ` <label for="start-time">שעת התחלה:</label>`;
    str += ` <input type="time" id="start-time" name="start-time" class="form-control" value="${timeStringStart}">`;
    str += `</div>`;
    str += `</div>`;
    str += `<p><strong>סטטוס:</strong> ${status}</p>`;
    if (Request.requestStatus == 0) {  //עדכון שעות אפשרי רק במידה והבקשה לא אושרה
        str += `<button value="עדכן" id="update"  onclick="update()" class="btn btn-primary btn-middle">עדכן</button>`;
    } else {
        str += " <p>על ידי " + Request.borrowFirstName + " " + Request.borrowFamilyName + "</p>";
        str += " <p>חניה: " + Request.borrowParkingName + "</p>";
    }
    str += `<button value="שמור עדכון" id="SaveUpdate" name="${Request.requestId}"  onclick="SaveUpdateRequest()" class="btn btn-primary btn-middle">שמור עדכון</button>`;
    str += `<button value="בטל" id="deleteRequest" name="${Request.requestId}" onclick="confirmDeleteRequest()" class="btn btn-primary btn-middle">בטל</button>`;
    str += "</div>";
    document.getElementById("myModalPopup").innerHTML = str;
}

function covertDate(date) {
    const isoString = date;
    const dateObj = new Date(isoString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return dateString = `${day}-${month}-${year}`; // output: "11-03-2022"
}

function Popup(MatchData, smartAlgorithem, borrowId) { //חלון קופץ לאחר לחיצה ל-פרטים
    borrows = JSON.parse(sessionStorage.getItem("borrows")); //שולפת מהאחסון את כל ההשאלות
    for (var i = 0; i < borrows.length; i++) { //מחפשת את ההשאלה שלחצו עליה
        if (borrows[i].id == borrowId) {
            borrow = borrows[i];
        }
    }
    dateStart = covertDate(borrow.startDate);
    dateEnd = covertDate(borrow.endDate);
    const isoString = borrow.startTime;
    const timeStringStart = isoString.slice(11, 16); // output: "10:30"
    const isoString2 = borrow.endTime
    const timeStringEnd = isoString2.slice(11, 16); // output: "10:30"
    if (borrow.status == 0) {  //השאלה עדיין לא מלאה לגמרי
        status = "פנוי לבקשות נוספות"
    }
    else status = "מושאל"
    var str = "";
    str += "<div class='modal-content-Popup'>";
    str += "<div class='close'>X</div>";
    str += `<h1><strong>מספר השאלה: </strong>${borrow.id}</h1>`;
    str += `<p><strong>שם חניה:</strong> ${borrow.parkingName}</p>`;
    str += `<p><strong>תאריך התחלה:</strong> ${dateStart}</p>`;
    str += `<p><strong>תאריך סיום:</strong> ${dateEnd}</p>`;
    str += `<div id="showHours">`;
    str += `<p><strong>שעת התחלה:</strong> ${timeStringStart}</p>`;
    str += `<p><strong>שעת סיום:</strong> ${timeStringEnd}</p>`;
    str += `</div>`;
    str += `<div class="row" id="hoursUpdate">`;    
    str += `<div class="col-xs-6">`;
    str += ` <label for="end-time">שעת סיום:</label>`;
    str += ` <input type="time" id="end-time" name="end-time" class="form-control" value="${timeStringEnd}"/>`;
    str += `</div>`;
    str += `<div class="col-xs-6">`;
    str += ` <label for="start-time">שעת התחלה:</label>`;
    str += ` <input type="time" id="start-time" name="start-time" class="form-control" value="${timeStringStart}">`;  
    str += `</div>`;  
    str += `</div>`; 
    str += `<p><strong>סטטוס:</strong> ${status}</p>`;
    str += `<button value="עדכן" id="update"  onclick="update()" class="btn btn-primary btn-middle">עדכן</button>`;
    str += `<button value="שמור עדכון" id="SaveUpdate" name="${borrow.id}"  onclick="SaveUpdate()" class="btn btn-primary btn-middle">שמור עדכון</button>`;
    str += `<button value="בטל" id="deleteBorrow" name="${borrow.id}" onclick="confirmDelete()" class="btn btn-primary btn-middle">בטל</button>`;
    if (MatchData.length > 0) { //אם חזרו לי מאצים
        str += "<div id='Listmatch'>";
        str += "<table>";
        str += "<tr><strong>מזמינים:</strong></tr>";
        for (var i = 0; i < MatchData.length; i++) {
            String = MatchData[i].requestStartTime;
            timeStartR = String.slice(11, 16); // output: "10:30"
            String = MatchData[i].requestEndTime;
            timeEndR = String.slice(11, 16); // output: "10:30"
            str += "<tr>";
            str += "<td><strong>מספר בקשה: </strong>" + MatchData[i].requestId +"</td>";
            str += "<td><strong>שם המזמין: </strong>" + MatchData[i].rFirstName + " " + MatchData[i].rFamilyName + "</td>";
            MatchStars = MatchData[i].requestStars;
            str += "<td id=MatchStars><strong>דירוג:</strong>";
            for (var k = 0; k < MatchStars; k++) {
                str += "<img src='images/Rating.png'/>"
            }
            str+="</td>";
            str += "<td><strong>שעות הזמנה: </strong>" + timeStartR + "-" + timeEndR + "</td>";
            if (MatchData[i].status == 0) {  //סטטוס של טבלת מאץ
                statusMatch = "ממתין לאישור";
                str += "<td><strong>סטטוס: </strong>" + statusMatch + "</td>";
                str += "<td><button id=" + MatchData[i].requestId + " name=" + MatchData[i].borrowId + " " +"onclick='approvedRequest(this.id)' class='greenBut'>אשר</button></td>";
            } else {
                statusMatch = "מאושר";
                str += "<td><strong>סטטוס: </strong>" + statusMatch + "</td>";
                str += "<td><button id=" + MatchData[i].requestId + " name=" + MatchData[i].borrowId + " " +"onclick='canceledRequest(this.id)' class='redBut'>בטל</button></td>";
            }
            str += "</tr>";
        }
        str += "</table>";
        str += "</div>";
    }
    if (smartAlgorithem.length > 0) { //רנדור אלגוריתם חכם
        str += "<div id='SmartAlgorithem'>"; /* הצגת האלגוריתם החכם*/
        str += "<table>";
        str += "<tr><strong>הצעה לשיבוץ חכם:</strong><img src='images/Smart.png'/> </tr>";
        counter = 0;
        SmartLength = smartAlgorithem.length
        for (var i = 0; i < smartAlgorithem.length; i++) {
           
            String = smartAlgorithem[i].requestStartTime;
            timeStartR = String.slice(11, 16); // output: "10:30"
            String = smartAlgorithem[i].requestEndTime;
            timeEndR = String.slice(11, 16); // output: "10:30"
            str += "<tr>";
            str += "<td><strong>מספר בקשה: </strong>" + smartAlgorithem[i].requestId + "</td>";
            str += "<td><strong>שם המזמין: </strong>" + smartAlgorithem[i].userFirstName + " " + smartAlgorithem[i].userLastName + "</td>";
            Stars = smartAlgorithem[i].userStars;
            str += "<td id=RateStars><strong>דירוג:</strong > "
            for (var j = 0; j < Stars; j++) {
            str+="<img src='images/Rating.png'/>"
            }
            str+="</td>";
            str += "<td><strong>שעות הזמנה: </strong>" + timeStartR + "-" + timeEndR + "</td>";
            str += "</tr>";
            if (smartAlgorithem[i].requestStatus==0) { //אם מישהו מהשיבוץ החכם לא מאושר
                counter++;
            }
        }
        str += "<tr>";
        if (counter == 0) { //כל מי שבשיבוץ החכם מאושר
            str += "<td><strong>השיבוץ החכם נבחר, השגת ניצולת מקסימלית!</strong></td>";
        } else {  //הדייר לא בחר בשיבוץ החכם
            str += "<td><button class='smartbtn' id=" + borrow.id + " " + "onclick='confirmSmartAlgorithm(this.id)'>בחר שיבוץ חכם</button></td>";
        }
        str += "</tr>";
        str += "</table>";
        str += "</div>";
    }
    str += "</div>";
    document.getElementById("myModalPopup").innerHTML = str; 
}

function update() {
    const update = document.getElementById("update"); //תופסת את כפתור עדכן
    update.style.display = "none"; // To hide the button
    const showHours = document.getElementById("showHours");//תפיסת השעות שהם מחרוזת
    showHours.style.display = "none"; // To hide div
    const SaveUpdate = document.getElementById("SaveUpdate");
    SaveUpdate.style.display = "block";  //מציגה
    const hours = document.getElementById("hoursUpdate"); //תפיסת דיב שעות שניתן לערוך
    hours.style.display = "block";  //הצגה של השעות שניתן לערוך   
}

function GetDetails(borrowId) { //לאחר ליחצה על כפתור לפרטים
    BorrowIdID = borrowId; //שמירה למשתנה גלובלי
    ajaxCall("Get", api +"GetMatch?IdBorrow="+ borrowId, "", GetMyMatchSCB, GetMyMatchECB); //מחזיר את כל המאצים שיש להשאלה הזאת
}

function GetAlgorithem(borrowId) { //מחזיר את האלגורתים החכם
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        var url = "https://localhost:7006/api/Algorithem/";
    } else {
        var url = "https://proj.ruppin.ac.il/cgroup44/prod/api/Algorithem/";
    }
    ajaxCall("Get", url + borrowId, "", GetAlgorithemSCB, GetAlgorithemECB); //מביא אלגוריתם חכם
}

function GetMyMatchSCB(data) {  //במקרה של הצלחה
    MatchData = data;
    GetAlgorithem(BorrowIdID);
}

function GetAlgorithemSCB(data) {
    smartAlgorithem = data; //שמירה למשתנה גלובלי
    $("#myModalPopup").css({ "display": "block" });  //להראות
    Popup(MatchData, smartAlgorithem, BorrowIdID);  //מרנדר פרטים של הפופ אפ
}

function GetAlgorithemECB(error) {
    MessageToUser('נכשל', 'חיבור עם צד שרת לא תקין');
}

function GetMyMatchECB(error) {
    MessageToUser('נכשל', 'חיבור עם צד שרת לא תקין');
}

function approvedRequest(idRequest) {  //לאחר לחיצה אשר בטבלת מוזמנים
    const button = document.getElementById(idRequest);  //תפיסה של הכפתור
    const idBorrow = button.getAttribute("name");
    objApproved = { //שליחת אובייקט לשרת
        IdBorrow: idBorrow,
        IdRequest: idRequest
    }
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        var url = "https://localhost:7006/api/Request/updateRequestForBorrow";
    } else {
        var url = "https://proj.ruppin.ac.il/cgroup44/prod/api/Request/updateRequestForBorrow";
    }
    ajaxCall("Put", url, JSON.stringify(objApproved), PutapprovedReqSCB, PutapprovedReqECB);  //שליחת בקשה לשרת
}

function PutapprovedReqSCB(data) { //פונקצית הצלחה
    if (data >= 1) {
        MessageToUser('הצלחה', 'הבקשה אושרה');
    } else {
        MessageToUser('נכשל', 'הבקשה הנ"ל מתנגשת עם בקשות אחרות שאישרת, אם ברצונך לאשר אותה בטל את הבקשות האחרות שאישרת');
    }
}

function PutapprovedReqECB(error) {  //במקרה של כישלון 
    MessageToUser('נכשל', 'כישלון באישור הבקשה');
}

function canceledRequest(idRequest) {  //לאחר לחיצה בטל בטבלת מוזמנים
    const button = document.getElementById(idRequest);  //תפיסה של הכפתור
    const idBorrow = button.getAttribute("name");
    objApproved = { //שליחת אובייקט לשרת
        IdBorrow: idBorrow,
        IdRequest: idRequest
    }
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        var url = "https://localhost:7006/api/Request/updateRequestcancealedForBorrow";
    } else {
        var url = "https://proj.ruppin.ac.il/cgroup44/prod/api/Request/updateRequestcancealedForBorrow";
    }
    ajaxCall("Put", url, JSON.stringify(objApproved), PutcanceledReqSCB, PutcanceledReqECB);  //שליחת בקשה לשרת
}

function PutcanceledReqSCB(data) { //פונקצית הצלחה
    MessageToUser('הצלחה', 'הבקשה בוטלה בהצלחה');
}

function PutcanceledReqECB(error) {  //במקרה של כישלון 
    MessageToUser('נכשל', 'כישלון בביטול הבקשה');
}

function confirmSmartAlgorithm(idBorrow) {
    $("#myModalPopupConfirm").css({ "display": "block" });
    var str = "";
    str += "<div class='modal-content-Popup'>";
    str += "<h1>שים לב ברגע שבחרת בשיבוץ החכם המוצע לך, בקשות שמתנגשות בזמנים יבוטלו, האם תרצה להמשיך?</h1>";
    str += "<div class='button-container'>";
    str += `<button value="כן" id="yesSmartAlgorithm" name="${idBorrow}" onclick="yes(this.id)" class="btn btn-primary btn-middle">כן</button>`;
    str += `<button value="לא" id="no"   onclick="no()" class="btn btn-primary btn-middle">לא</button>`;
    str += "</div>";
    str += "</div>";
    document.getElementById("myModalPopupConfirm").innerHTML = str;
}

function ChooseSmartAlgorithm(idBorrow) { //לאחר לחיצה על בחירת שיבוץ חכם עדכון המבקשים//
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        var url = "https://localhost:7006/api/Algorithem/ChooseSmartAlgorithm";
    } else {
        var url = "https://proj.ruppin.ac.il/cgroup44/prod/api/Algorithem/ChooseSmartAlgorithm";
    }
    ajaxCall("Put", url, JSON.stringify(idBorrow), PutChooseSmartAlgorithmSCB, PutChooseSmartAlgorithmECB);  //שליחת בקשה לשרת
}

function PutChooseSmartAlgorithmSCB(data) {
    if (data == 1) {
        MessageToUser('הצלחה', 'השיבוץ החכם בוצע בהצלחה!');
    }
    else {
        PutChooseSmartAlgorithmECB(data);
    }
}

function PutChooseSmartAlgorithmECB(error) {
    MessageToUser('נכשל', 'כישלון בשיבוץ החכם אנא נסה שנית');
    console.log(error);
}

function SaveUpdate() {  //שמירת עדכון שעות השאלה
    const button = document.getElementById("SaveUpdate");
    const id = button.getAttribute("name");
    const sT = $("#start-time").val();  //שעת התחלה
    const startT = timeConversion(sT);

    const eT = $("#end-time").val();    //קליטת שעת סיום מהמשתמש         
    const endT = timeConversion(eT)

    borrows = JSON.parse(sessionStorage.getItem("borrows")); //מחפשת את ההשאלה שרצה לעדכן
    for (var i = 0; i < borrows.length; i++) {
        if (borrows[i].id == id) {
            borrow = borrows[i];
        }
    }

    Borrow = {      //ההשאלה עם העדכון של השעות
        startDate: borrow.startDate,
        endDate: borrow.endDate,
        startTime: startT,
        endTime: endT,
        parkingName: borrow.parkingName,
        email: borrow.email,
        id: id,
        status: borrow.status
    }
    ajaxCall("put", api +"UPDATE", JSON.stringify(Borrow), putMyBorrowsSCB, putMyBorrowsECB);
}

function SaveUpdateRequest() {
    const button = document.getElementById("SaveUpdate");
    const id = button.getAttribute("name");
    const sT = $("#start-time").val();  //שעת התחלה
    const startT = timeConversion(sT);

    const eT = $("#end-time").val();    //קליטת שעת סיום מהמשתמש         
    const endT = timeConversion(eT)

    var Requests = JSON.parse(sessionStorage.getItem("Request")); //שולפת מהאחסון את כל הבקשות
    for (var i = 0; i < Requests.length; i++) { //מחפשת את הבקשה שלחצו עליה
        if (Requests[i].requestId == id) {
            SRequest = Requests[i];
        }
    }
    Request = {      //הבקשה עם העדכון של השעות
        startDate: SRequest.requestStartDate,
        endDate: SRequest.requestEndDate,
        startTime: startT,
        endTime: endT,
        email: SRequest.requestEmail,
        id: id,
        status: SRequest.requestStatus
    }
    ajaxCall("Put", url + "updateRequestHours", JSON.stringify(Request), putMyRequestSCB, putMyRequestECB);
}

function timeConversion(time) {  //המרת הזמן שהמשתמש מכניס לפורמט מתאים לשרת

    // Create a new Date object with the given time
    var dateObj = new Date('1970-01-01T' + time + '+02:00');

    // Add two hours to the date
    dateObj.setHours(dateObj.getHours() + 2);

    // Convert the date to the desired format and remove the trailing 'Z'
    var formattedDate = dateObj.toISOString().replace("Z", "");

    // Return the formatted date
    return formattedDate;
}

function putMyBorrowsSCB(data) {
    if (data == 1) {
        MessageToUser('הצלחה', 'ההשאלה עודכנה בהצלחה');
    }
    else putMyBorrowsECB();
}

function putMyBorrowsECB() {
    MessageToUser('נכשל', 'כישלון בעדכון ההשאלה');
}

function confirmDelete() {
    $("#myModalPopupConfirm").css({ "display": "block" });
    var str = "";
    str += "<div class='modal-content-Popup'>";
    str += "<h1>האם אתה בטוח שאתה רוצה למחוק השאלה זו?</h1>";
    str += "<div class='button-container'>";
    str += `<button value="כן" id="yes"  onclick="yes(this.id)" class="btn btn-primary btn-middle">כן</button>`;
    str += `<button value="לא" id="no"   onclick="no()" class="btn btn-primary btn-middle">לא</button>`;
    str += "</div>";
    str += "</div>";
    document.getElementById("myModalPopupConfirm").innerHTML = str;
}

function yes(id) {
    if (id == "yes") {
        deleteBorrow();
    }
    if (id == "yesRequest") {
        deleteRequest();
    }
    if (id == "yesSmartAlgorithm") {
        const button = document.getElementById("yesSmartAlgorithm");
        const idBorrow = button.getAttribute("name");
        ChooseSmartAlgorithm(idBorrow);
    }
}

function no() {
    window.location = "PersonalArea.html";
}

function confirmDeleteRequest() { //מוודא שרוצה למחוק בקשה
    $("#myModalPopupConfirm").css({ "display": "block" });
    var str = "";
    str += "<div class='row modal-content-Popup'>";
    str += "<h1>האם אתה בטוח שאתה רוצה למחוק בקשה זו?</h1>";
    str += "<div class='button-container'>";
    str += `<button value="כן" id="yesRequest" onclick="yes(this.id)" class="btn btn-primary btn-middle">כן</button>`;
    str += `<button value="לא" id="no" onclick="no()" class="btn btn-primary btn-middle">לא</button>`;
    str += "</div>";
    str += "</div>";
    document.getElementById("myModalPopupConfirm").innerHTML = str;
}

function deleteBorrow() {
    const button = document.getElementById('deleteBorrow');
    const id2 = button.getAttribute("name");    //תפיסה של המספר השאלה
    borrows = JSON.parse(sessionStorage.getItem("borrows"));
    for (var i = 0; i < borrows.length; i++) {
        if (borrows[i].id == id2) {
            borrow = borrows[i];
        }
    }
    ajaxCall("Delete", api +"Id/"+ borrow.id +"/Mail/"+ borrow.email, "", DeleteMyBorrowsSCB, DeleteMyBorrowsECB);
}

function deleteRequest() { //מחיקת בקשה
    const button = document.getElementById('deleteRequest');
    const idRequest = button.getAttribute("name");    //תפיסה של המספר הבקשה
    ajaxCall("Delete", url + "Id/" + idRequest, "", DeleteMyRequestSCB, DeleteMyRequestECB);
}

function DeleteMyBorrowsSCB(data) {
    if (data == 1) {
        MessageToUser('הצלחה', 'ההשאלה בוטלה בהצלחה');
    }
    else DeleteMyBorrowsECB();
}

function DeleteMyBorrowsECB() {
    MessageToUser('נכשל', 'כישלון בביטול השאלה');
}

function putMyRequestSCB(data) {
    if (data == 1) {
        MessageToUser('הצלחה', 'הבקשה עודכנה בהצלחה');
    }
    else putMyBorrowsECB();
}

function putMyRequestECB() {
    MessageToUser('נכשל', 'כישלון בעדכון הבקשה');
}

function DeleteMyRequestSCB(data) {
    if (data == 1) {
        MessageToUser('הצלחה', 'הבקשה בוטלה בהצלחה');
    }
    else DeleteMyRequestECB();
}

function DeleteMyRequestECB() {
    MessageToUser('נכשל', 'כישלון בביטול הבקשה');
}

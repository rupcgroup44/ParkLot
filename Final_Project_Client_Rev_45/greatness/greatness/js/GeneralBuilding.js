
$(document).ready(function () {
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/Request/";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/Request/";
    }

    userData = JSON.parse(sessionStorage.getItem("userLogin"));
    email = userData.email;
    UserIdBillding = userData.idBuilding;

    ajaxCall("GET", api + "GetAllRequests/" + email, "", getAllRequestSCB, getAllRequestECB); //שליפת הבקשות הכלליות של הבניין

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

    $('#myModal').on('hidden.bs.modal', function () { //הודעה קופצת
        if ($('#title').text() == 'הצלחה') {
            window.location = "GeneralBuilding.html";
        }
    });

});

function getAllRequestSCB(data) { //במידה בקשות
    console.log(data);
    if (data.length >= 1) {
        renderAllRequests(data); //הצגה בדף
    } else {
        getAllRequestECB(data);
    }
}

function getAllRequestECB(erorr) {  //במידה ולא קיימות לי בקשות
    console.log(erorr);
    str = "<div class='gtco-container justify-content-center frame BorrowShow4'>";
    str += "<p> <strong>לא קיימות בקשות</p></div > ";
    document.getElementById("showAllRequests").innerHTML = str;
}

function renderAllRequests(data) {
    sessionStorage.setItem("AllRequests", JSON.stringify(data));  //שמירה באחסון מקומי
    var str = "";
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
        str += "<p> <strong>שם המבקש:</strong> " + data[i].userFirstName + " " + data[i].userLastName+ "</p>";
        UserStars = data[i].userStars;
        str += "<p id=UserStars><strong>דירוג:</strong>";
        for (var k = 0; k < UserStars; k++) {
            str += "<img src='images/Rating.png'/>"
        }
        str += "</p >";
        str += `<button value="עזור לשכן" id="${data[i].requestId}" onclick="ApproveRequest(this.id)" class="btn btn-primary btn-middle">עזור לשכן</button>`;
        str += "</div>";
    }
    document.getElementById("showAllRequests").innerHTML = str;
}

function sendingRequest(requestId) {  //לאחר לחיצה על בקש בקשה זו מההשאלה הספציפית שנבחרה
    for (var i = 0; i < ExistingRequests.length; i++) { //מחפשת את הבקשה שלחצו עליה
        if (ExistingRequests[i].requestId == requestId) {
            selectedRequest = ExistingRequests[i];
        }
    }

    requestST = timeConversion(selectedRequest.requestStartTime);
    requestET = timeConversion(selectedRequest.requestEndTime);
    requestSD = covertDate(selectedRequest.requestStartDate);
    requestED = covertDate(selectedRequest.requestEndDate);
    //בדיקה שאין הזמנה לאותה החניה על ידי אותו הדייר
    ajaxCall("GET", api + "CheckingRequestBeforInsert?idBorrow=" + BorrowIdForGetR + "&email_request=" + email + "&startDate=" + requestSD + "&endDate=" + requestED + "&startTime=" + requestST + "&endTime=" + requestET, "", GetCheckingRequestSCB, GetCheckingRequestECB);
}

function GetCheckingRequestSCB(data) {  //במידה ועמד בבדיקה- כלומר אין בקשה לאותו החניה על ידי אותו הדייר
    if (data == 0) {
        if (
            location.hostname == "localhost" ||
            location.hostname == "127.0.0.1" ||
            location.hostname == ""
        ) {
            var api = "https://localhost:7006/Match";
        } else {
            var api = "https://proj.ruppin.ac.il/cgroup44/prod/Match";
        }
        obj = {
            IdBorrow: BorrowIdForGetR,
            IdRequest: selectedRequest.requestId
        }
        ajaxCall("POST", api, JSON.stringify(obj), postMatchSCB, postMatchECB); // הכנסת בקשה לבסיס נתונים
    }
    else GetCheckingRequestECB(data);  //אחרת
}

function GetCheckingRequestECB(error) {  //קיימת כבר בקשה לאותה החניה על ידי אותו הדייר
    MessageToUser('כשלון', 'שיים לב! קיימת לך כבר בקשה לחנייה זו, לא ניתן לבקשה כמה פעמיים לאותה החניה');
}

function postMatchSCB(data) { //במידה והצליח להכניס לטבלת מאץ
    if (data >= 1) {
        const submitBtn = document.getElementById(BorrowIdForGetR);
        const email = submitBtn.getAttribute("name");
        if (
            location.hostname == "localhost" ||
            location.hostname == "127.0.0.1" ||
            location.hostname == ""
        ) {
            var api = "https://localhost:7006/request";
        } else {
            var api = "https://proj.ruppin.ac.il/cgroup44/prod/request";
        }
        objForMail = {
            IdBorrow: BorrowIdForGetR,
            Email: email
        }
        ajaxCall("POST", api, JSON.stringify(objForMail), postMAILSCB, postMAILECB); // שליחת מייל למשאיל
    } else postMatchECB;
}

function postMatchECB(erro) { //במידה ולא הצליח להכניס לטבלאות
    MessageToUser('נכשל', 'יש בעיה בשליחת הבקשה');
}

function postMAILSCB(data) { //במידה והצליח לשלוח מייל
    MessageToUser('הצלחה', 'נשלחה בקשה למשאיל/ה, ברגע שהבקשה תאושר תקבל מייל על כך');
}

function postMAILECB(erro) {  //במידה ולא הצליח לשלוח מייל
    MessageToUser('נכשל', 'יש בעיה בשליחת הבקשה');
}

function covertDate(date) {
    const isoString = date;
    const dateObj = new Date(isoString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return dateString = `${day}-${month}-${year}`; // output: "11-03-2022"
}

function ApproveRequest(requestId) {
    selectedrequestId = requestId;
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        url = "https://localhost:7006/api/Borrow";
    } else {
        url = "https://proj.ruppin.ac.il/cgroup44/prod/api/Borrow";
    } 
    ajaxCall("GET", url + "/parking/" + email, "", getParkingSCB, getParkingECB);
}

function getParkingSCB(data) {//הצלחה בהוצאת החניות
    console.log(data);
    $("#myModalPopup").css({ "display": "block" });  //להראות
    RenderParking(data);
}

function getParkingECB(err) {//כישלון בהוצאת החניות
    alert("בעיה בשליפת שמות החניות של המשתמש");
    console.log(err);
}

function RenderParking(data) {
    var str = "";
    str += "<div class='modal-content-Popup'>";
    str += "<div class='close'>X</div>";
    str += "<div>";
    str += "<br></br>";
    str += `<p><strong>בחר את החניה אותה תרצה להשאיל:</strong>  `; 
    str += "<select name='parking' id='parkingnames'>";

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            str += "<option value='" + data[i] + "'>" + data[i] + "</option>";
        }
    } else {
        str += "<option value='" + data + "'>" + data + "</option>";
    }
    str += "</select>";
    str += "</p >";
    str += "</div >";
    str += `<button value="אשר" id="approve"  onclick="approve()" class="btn btn-primary btn-middle">אשר</button>`;
    str += "</div>";
    document.getElementById("myModalPopup").innerHTML = str;
}

function approve() {
    const parkingN = document.getElementById("parkingnames").value
     var AllRequests = JSON.parse(sessionStorage.getItem("AllRequests")); //שולפת מהאחסון את כל הבקשות
    for (var i = 0; i < AllRequests.length; i++) { //מחפשת את הבקשה שלחצו עליה
        if (AllRequests[i].requestId == selectedrequestId) {
            selectedRequest = AllRequests[i];
        }
    }
    OrderstartTime = timeConversion(selectedRequest.requestStartTime);
    OrderEndTime = timeConversion(selectedRequest.requestEndTime);
    Borrow = {
        startDate: selectedRequest.requestStartDate,
        endDate: selectedRequest.requestEndDate,
        startTime: OrderstartTime,
        endTime: OrderEndTime,
        parkingName: parkingN,
        email: email,
        id:0,
        status:0
    }
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        url1 = "https://localhost:7006/ApproveRequest/";
    } else {
        url1 = "https://proj.ruppin.ac.il/cgroup44/prod/ApproveRequest/";
    }
    ajaxCall("POST", url1 + selectedrequestId, JSON.stringify(Borrow), postApproveRequestSCB, postApproveRequestECB);
}

function timeConversion(timeStr) {  //המרת הזמן שהמשתמש מכניס לפורמט מתאים לשרת

    // Create a new Date object with the current date
    const currentDate = new Date();
    const [date1, time] = timeStr.split("T");
    // Set the hours and minutes of the Date object using the user's input
    const [hours, minutes] = time.split(":");
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    // Add three hours to the Date object
    currentDate.setTime(currentDate.getTime() + (3 * 60 * 60 * 1000));
    // Format the Date object as a string in the desired format
    const formattedDate = currentDate.toISOString();

    console.log(formattedDate); // Output: "2023-04-16T08:00:00.000Z"
    return formattedDate;
}

function postApproveRequestSCB(data) {
    if (data == 1) {
        MessageToUser('הצלחה', 'עזרה לשכן הצליחה');
    }
    else postApproveRequestECB(data);
}

function postApproveRequestECB(error) {
    console.log(error);
    MessageToUser('נכשל','כישלון בעזרה לשכן- בדוק אם קיימת אצלך השאלה בזמנים אלו שכבר מאושרת לדיירים אחרים');
}

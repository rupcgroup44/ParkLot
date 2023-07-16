

$(document).ready(function () {
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/User";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/User";
    }
    userData = JSON.parse(sessionStorage.getItem("userLogin"));
    GetParkingName();
    GetPhones();

    $('#UpdateBtnP').click(function () {
        const SaveBTN = document.getElementById("SaveBtnP");//הצגת כפתור שמירה
        SaveBTN.style.display = "block";
        const UpdBTN = document.getElementById("UpdateBtnP"); //תופסת את כפתור עדכן
        UpdBTN.style.display = "none"
        const Form = document.getElementById("ChangeDetails"); //תופסת את כפתור עדכן
        Form.style.display = "block"
        const Details = document.getElementById("PhDetails"); //תופסת את כפתור עדכן
        Details.style.display = "none"

    });
    $('#SaveBtnP').click(function () {
        UpdateDetails();

    });
    $("#ProfileForm").submit(function () { //כניסה למערכת
        return false;
    })
    $('#myModal').on('hidden.bs.modal', function () {
        if ($('#title').text() == 'הצלחה') {
            window.location = "ProfilePage.html";
        }
    });
});

function GetPhones() { //הוצאת טלפונים לפי מייל של המשתמש
    let email = userData.email;
    ajaxCall("GET", api +"/"+ email + "/getPhones", "", getPhonesSCB, getPhonesECB);
}

function getPhonesSCB(data) {
    console.log(data);
    RenderAdress(data);
    ShowDetails(data);   
}

function getPhonesECB(err) {
    MessageToUser('בעיה בשליפת הטלפונים של המשתמש');
    console.log(err);
}

function ShowDetails(data) {//שם את הפרטים של המשתמש בתוך הפקדים
    document.getElementById("firstName").value = userData.firstName;
    document.getElementById("familyName").value = userData.familyName;
  
    if (data.length > 1) {//אם יש כמה טלפונים
        for (let i = 0; i < data.length; i++) {
            document.getElementById("phone"+[i+1]).value = data[i];  
        }
    }
    else {
        document.getElementById("phone1").value = data;
    }
}

function GetParkingName() { //הוצאת חניות לפי מייל של המשתמש
    let email = userData.email;
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api1 = "https://localhost:7006/api/Borrow";
    } else {
        api1 = "https://proj.ruppin.ac.il/cgroup44/prod/api/Borrow";
    }
    ajaxCall("GET", api1 + "/parking/" + email, "", getParkingSCB, getParkingECB);
}

function getParkingSCB(data) {//הצלחה בהוצאת החניות
    console.log(data);
    RenderParking(data);
   
}

function getParkingECB(err) {//כישלון בהוצאת החניות
    MessageToUser('בעיה בשליפת שמות החניות של המשתמש');
    console.log(err);
}

function RenderParking(data) {//מרנדר את שמות החניות ודירוג של המשתמש
    var str2 = "";
    str2 += "<p>מייל: " + userData.email + "</p>";
    str2 += "<p>כתובת: " + userData.street + " " + userData.buildingNumber + ", " + userData.city + "</p></div>";
    document.getElementById("Generalinfo").innerHTML += str2;
    var str4 = "";
    
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            str4 += "<p>" + data[i] +"</p>";
        
        }
    } else {
        str4 += "<p>" + data + "</p>";
    }
    document.getElementById("Parking").innerHTML += str4;
    var strRate = "<p><strong>דירוג:<strong>";
    for (var j = 0; j < userData.rate1; j++) {
       
        strRate += "<img src='images/Rating.png'/>"
    }
    strRate +="</p>"
    document.getElementById("RateUser").innerHTML += strRate; 
}

function RenderAdress(data) {//רינדור פרטים שלא ניתן לשנות 
    var str5 = " <div class='col-sm-12 col-md-12'>";
    str5 += "<p>שם פרטי: " + userData.firstName+ "</p>";
    str5 += "<p>שם משפחה: " + userData.familyName + "</p>";

    if (data.length > 1) {//אם יש כמה טלפונים
        for (let i = 0; i < data.length; i++) {
            str5 += "<p>טלפון: "+data[i]+"</p>";
        }
    }
    else {
        str5 += "<p>טלפון: " + data + "</p>";
    }
   
    document.getElementById("PhDetails").innerHTML += str5;
    
}

function UpdateDetails() {//עדכון פרטי משתמש
    newFirstName = document.getElementById("firstName").value;
    newFamilyName = document.getElementById("familyName").value;
    UserDetails = {
        Email: userData.email,
        firstName: newFirstName,
        familyName:newFamilyName,
        phone1: document.getElementById("phone1").value,
        phone2: document.getElementById("phone2").value
    }

    ajaxCall("PUT", api + "/UPDATE/user/details", JSON.stringify(UserDetails), UpdateUserSCB, UpdateUserECB);
}
function UpdateUserSCB(data) {
    console.log(data);
    userData.firstName = newFirstName;
    userData.familyName = newFamilyName;

    //  לשמור את הערכים המעודכנים ב-session storage
    sessionStorage.setItem("userLogin", JSON.stringify(userData));
    MessageToUser('הצלחה', 'עדכון פרטים הושלם!');
}
function UpdateUserECB(err) {
    console.log(err);
}
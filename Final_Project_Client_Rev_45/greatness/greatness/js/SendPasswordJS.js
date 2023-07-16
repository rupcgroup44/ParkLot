
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
    $('#sendPasswordtoMail').click(function() {

    SendPassword();
    });
    $('#myModal').on('hidden.bs.modal', function () { //הודעה קופצת
        if ($('#title').text() == 'שליחת המייל בוצעה בהצלחה') {
            window.location = "loginParkingPage.html";
        }
    });

});

function SendPassword() {//הוצאת סיסמא של המשתמש
    mail = $("#email").val();
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api2 = "https://localhost:7006/api/User/SendPAS/ToUser/";
    } else {
        api2 = "https://proj.ruppin.ac.il/cgroup44/prod/api/User/SendPAS/ToUser/";
    }
    ajaxCall("GET", api2 + mail,"", GetPasSCB, GetPasECB);
}

function GetPasSCB(data) {
    console.log(data);
    if (data == 1) {
        MessageToUser('שליחת המייל בוצעה בהצלחה', 'תועבר לדף ההתחברות לאחר לחיצה על כפתור ה-X');
        
    } else if (data==0){
        GetPasECB(err)
    }
}
function GetPasECB(err) {
    MessageToUser('שליחת המייל נכשלה', 'תועבר לדף ההתחברות לאחר לחיצה על כפתור ה-X');
    console.log(err)
}
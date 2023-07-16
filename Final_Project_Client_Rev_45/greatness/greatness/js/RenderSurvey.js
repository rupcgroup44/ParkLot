$(document).ready(function () {
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/User/AnswerTheQuarterlySurvey/";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/User/AnswerTheQuarterlySurvey/";
    }

    userData = JSON.parse(sessionStorage.getItem("userLogin"));
    email = userData.email;

    ajaxCall("GET", api + email, "", GetSurveySCB, GetSurveyECB);  //בדיקה אם ענה כבר על הסקר ברבעון והשנה נוחכית

    $(document).on('click', '#SurveyBTN', function () {//בלחיצה על כפתור מענה לסקר נעביר אותו לדף הסקר
        window.location = "SurveyPage.html";

    });
});

function GetSurveySCB(data) {
    if (data==0) {   //אם לא ענה עדיין על הסקר ברבעון והשנה הנוכחית
        renderSurvey();  //תציג את כפתור הסקר
    }
}

function GetSurveyECB(error) {
    console.log(error);
}

function renderSurvey() {  //מרנדר את כפתור הסקר
    $("#SurveyShow").css({ "display": "block" });
    str10 = "<button id='SurveyBTN'>מעבר לסקר</button>";
    str10 += "<p id='PSurvey'>-סקר שביעות רצון מחכה למענה, לאחר מילוי הסקר תקבל/י מטבע נוסף</p>"
    document.getElementById("SurveyDiv").innerHTML = str10;

}

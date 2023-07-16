$(document).ready(function () {
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/User/InsertSurvey";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/User/InsertSurvey";
    }


    $("#SurveyForm").submit(function () {
        checkSurveyForm();
        return false;
    })

    $('#myModal').on('hidden.bs.modal', function () {
        if ($('#title').text() == 'סקר נשלח בהצלחה') {
            window.location = "homePage.html";
        }
    });

});

function checkSurveyForm() {
    var form = document.getElementById("SurveyForm");
    var questions = form.querySelectorAll('input[type="radio"]');

    var allAnswered = true;
    var answeredQuestions = {};

    for (var i = 0; i < questions.length; i++) {
        if (questions[i].checked) {
            var questionNumber = questions[i].name.slice(-1);
            answeredQuestions[`q${questionNumber}`] = true;
        }
    }

    for (var i = 1; i <= 5; i++) {
        if (!answeredQuestions[`q${i}`]) {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        MessageToUser('שליחה נכשלה', 'חובה לענות על כל השאלות בסקר');
        return;
    }
    // if all questions have been answered, submit the form
    PostSurvey();
}

function PostSurvey() {//הכנסת תשובות הדייר לסקר לבסיס הנתונים
    const inputs = document.querySelectorAll('#Survey input[type="radio"]');
    selectedValues = {};

    inputs.forEach(input => {
        const questionNumber = input.name.slice(-1);
        if (input.checked) {
            selectedValues[`q${questionNumber}`] = input.value;
        }
    });

    console.log(selectedValues); // log the selected values to the console
    userData = JSON.parse(sessionStorage.getItem("userLogin"));
    email = userData.email;
    objSurvey = { //שליחת אובייקט לשרת
        email: email,
        Q1: selectedValues['q1'],
        Q2: selectedValues['q2'],
        Q3: selectedValues['q3'],
        Q4: selectedValues['q4'],
        Q5: selectedValues['q5']
    }
    ajaxCall("POST", api, JSON.stringify(objSurvey), PostSurveySCB, PostSurveyECB);
}

function PostSurveySCB(data) {
    MessageToUser('סקר נשלח בהצלחה', 'תודה שמילאתם את הסקר, מיד יועבר לחשבונכם מטבע!');
}

function PostSurveyECB(error) {
    console.log(error);
}
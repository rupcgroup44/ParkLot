
$(document).ready(function () {
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/Admin";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/Admin";
    }
    CountAllUsers();
    CountAllBorrows();
    CountAllrequest();
    CountAllMatch();
    GetBuilding();
    const input = document.getElementById("Adress");
    const datalist = document.getElementById("cityDL");
    document.getElementById("ShowBuilding").addEventListener("click", function () {
        const selectedOption = datalist.querySelector(`option[value="${input.value}"]`);
        idbuilding = selectedOption.id
        createChart();
        console.log(selectedOption.id);
    });

    const input2 = document.getElementById("Adress2");
    const datalist2 = document.getElementById("cityDL2");
    document.getElementById("ShowHours").addEventListener("click", function () {
        const selectedOption2 = datalist2.querySelector(`option[value="${input2.value}"]`);
        idbuilding2 = selectedOption2.id;
        month = $('#Month').val();
        createHoursChart();
        console.log(selectedOption2.id);
    });

    const input4 = document.getElementById("AdressCoins");
    const datalist4 = document.getElementById("cityDLCoins");
    document.getElementById("ShowBuilding4").addEventListener("click", function () {
        const selectedOption4 = datalist.querySelector(`option[value="${input4.value}"]`);
        idbuilding4 = selectedOption4.id
        createChartforCoins();
        console.log(selectedOption4.id);
    });


    // Get the current year
    var currentYear = new Date().getFullYear();

    // Generate a list of years from 2022 to the current year
    var yearList = '';
    for (var year = 2022; year <= currentYear; year++) {
        yearList += '<option value="' + year + '">' + year + '</option>';
    }

    // Add the options to the input list
    document.getElementById('year-input').innerHTML = yearList;

    // Get the button element
    var showButton = document.getElementById('ShowBuilding3');

    // Add an event listener to the button
    showButton.addEventListener('click', function () {
        // Get the selected values of the year-input, quarterly, and questions elements
        var yearValue = document.getElementById('year-input').value;
        var quarterlyValue = document.getElementById('quarterly').value;
        var questionValue = document.getElementById('questions').value;

        // Do something with the selected values, such as pass them to a function that generates the chart
        createChartforSurvey(yearValue, quarterlyValue, questionValue);
    });
});



function CountAllUsers() {//כמה משתמשים רשומים סהכ לאתר
       
 ajaxCall("GET", api, "", getSuccess, geterror);

}//כמה משתמשים רשומים בסה"כ
function getSuccess(data) {
    $('#users-number').text(data);

    
};//הצלחה
function geterror(err) {
    alert("בעיה בשליפת מספר המשתמשים");
    console.log(err);
};//כישלון

function CountAllBorrows() {//כמה משתמשים רשומים סהכ לאתר
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
         api = "https://localhost:7006/count/borrow";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/count/borrow";
    }
    ajaxCall("GET", api, "", getBSuccess, getBerror);

}//כמה השאלות
function getBSuccess(data) {
    $('#help-number').text(data);
};//הצלחה
function getBerror(err) {
    alert("בעיה בשליפת מספר ההשאלות");
    console.log(err);
};//כישלון

function CountAllrequest() {//כמה משתמשים רשומים סהכ לאתר
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/count/request/Admin";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/count/request/Admin";
    }
   
    ajaxCall("GET", api, "", getRSuccess, getRerror);

}//כמה בקשות בסה"כ
function getRSuccess(data) {
    $('#requests-number').text(data);
};//הצלחה
function getRerror(err) {
    alert("בעיה בשליפת מספר הבקשות");
    console.log(err);
};//כישלון

function CountAllMatch() {//כמה מאצ'ים היו
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/count/request/Admin/Match";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/count/request/Admin/Match";
    }
    ajaxCall("GET", api, "", getMSuccess, getRerror);

}//כמה מאצים בסה"כ
function getMSuccess(data) {
    $('#Match-number').text(data);
};//הצלחה
function getMerror(err) {
    alert("בעיה בשליפת מספר המאצים");
    console.log(err);
};//כישלון


function createChart() {//כמה בקשות אושרו מתוך הסהכ
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/Admin/" + idbuilding;
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/Admin/" + idbuilding;
    }
    ajaxCall("GET", api, "", MatchTSCB, MatchTECB);
}//כמה בקשות אושרו מתוך הסה"כ

function MatchTSCB(data) {
    if (data.length == 0) {
        alert("לא קיימים נתונים עבור בניין זה")
    }
    else {
   // Group the data by month
    var monthlyData = {};
    data.forEach(function (item) {
        monthlyData[item.month] = {
            requests: item.requests,
            confirm: item.confirm
        };
    });

    // Check if a chart with ID 'myChart' already exists
    var existingChart = Chart.getChart("myChart");
    if (existingChart) {
        existingChart.destroy();
    }

    // Create the chart
    var canvas3 = document.getElementById('myChart');
    var ctx3 = canvas3.getContext('2d');
    var chart3 = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
            datasets: [{
                label: 'בקשות',
                data: [
                    monthlyData.January ? monthlyData.January.requests : 0,
                    monthlyData.February ? monthlyData.February.requests : 0,
                    monthlyData.March ? monthlyData.March.requests : 0,
                    monthlyData.April ? monthlyData.April.requests : 0,
                    monthlyData.May ? monthlyData.May.requests : 0,
                    monthlyData.June ? monthlyData.June.requests : 0,
                    monthlyData.July ? monthlyData.July.requests : 0,
                    monthlyData.August ? monthlyData.August.requests : 0,
                    monthlyData.September ? monthlyData.September.requests : 0,
                    monthlyData.October ? monthlyData.October.requests : 0,
                    monthlyData.November ? monthlyData.November.requests : 0,
                    monthlyData.December ? monthlyData.December.requests : 0
                ],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }, {
                label: 'אושרו',
                data: [
                    monthlyData.January ? monthlyData.January.confirm : 0,
                    monthlyData.February ? monthlyData.February.confirm : 0,
                    monthlyData.March ? monthlyData.March.confirm : 0,
                    monthlyData.April ? monthlyData.April.confirm : 0,
                    monthlyData.May ? monthlyData.May.confirm : 0,
                    monthlyData.June ? monthlyData.June.confirm : 0,
                    monthlyData.July ? monthlyData.July.confirm : 0,
                    monthlyData.August ? monthlyData.August.confirm : 0,
                    monthlyData.September ? monthlyData.September.confirm : 0,
                    monthlyData.October ? monthlyData.October.confirm : 0,
                    monthlyData.November ? monthlyData.November.confirm : 0,
                    monthlyData.December ? monthlyData.December.confirm : 0
                ],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    }
 
}//הצלחה
function MatchTECB() {
    console.log('Failed to retrieve data from the server');
}//כישלון


function createChartforSurvey(yearValue, quarterlyValue, questionValue) {//תוצאות הסקר
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/ReadResultsOfTheSurvey/QuestionNumber/" + questionValue + "/quarter/" + quarterlyValue + "/year/" + yearValue; 
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/ReadResultsOfTheSurvey/QuestionNumber/" + questionValue + "/quarter/" + quarterlyValue + "/year/" + yearValue;
    }
    
    ajaxCall("GET", api, "", ResultsOfTheSurveySCB, ResultsOfTheSurveyECB);
}
function ResultsOfTheSurveySCB(data) {
    if (data.every(element => element === 0)) {
        // Execute this block of code if all elements in the array are zero
        alert("לא קיימים נתונים עבור סינון זה ");
    } else {
        var surveyData = data;
    var numberMax = checkMax(data);
    // Check if a chart with ID '0' already exists
    // Destroy the existing chart with ID '0'
    var existingChart = Chart.getChart('mySurveyChart');
    if (existingChart) {
        existingChart.destroy();
    }

    // Select the canvas element
    var canvas = document.getElementById('mySurveyChart');

    // Create the chart
    var myChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['מאוד לא מסכים', 'לא מסכים', 'מתלבט', 'מסכים', 'מסכים מאוד'],
            datasets: [{
                label: 'תוצאות הסקר',
                data: surveyData,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: numberMax,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    }
   
}
function ResultsOfTheSurveyECB(error) {
    console.log('Failed to retrieve data from the server');
    console.log(error);
}

function createChartforCoins() { // כמות המטבעות שנותרו למשתמשים
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/ReadCountUsersByCoinsRange/idBuilding/" + idbuilding4;
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/ReadCountUsersByCoinsRange/idBuilding/" + idbuilding4;
    }
    ajaxCall("GET", api, "", ResultsOfTheCoinsSCB, ResultsOfTheCoinsECB);
}
function ResultsOfTheCoinsSCB(data) {
    if (data.every(element => element === 0)) {
        // Execute this block of code if all elements in the array are zero
        alert("לא קיימים נתונים עבור סינון זה ");
    } else {
    var surveyData = data;
    var numberMax= checkMax(data);
    // Check if a chart with ID '0' already exists
    // Destroy the existing chart with ID '0'
    var existingChart = Chart.getChart('myChartCoins');
    if (existingChart) {
        existingChart.destroy();
    }

    // Select the canvas element
    var canvas = document.getElementById('myChartCoins');

    // Create the chart
    var myChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['0-5', '6-10', '11-15', 'מעל 15'],
            datasets: [{
                label: 'כמות מטבעות',
                data: surveyData,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: numberMax,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
        }

}
function ResultsOfTheCoinsECB(error) {
    console.log('Failed to retrieve data from the server');
    console.log(error);
}

function checkMax(arry) {
    max = 0;
    for (var i = 0; i < arry.length; i++) {

        if (arry[i] > max) {
            max = arry[i];
        }
    }
    return max;
}
function createHoursChart() {//בקשות לחניה לפי שעות 
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/api/Admin/" + idbuilding2 + "/" + month;
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/api/Admin/" + idbuilding2 + "/" + month;
    }
   
    ajaxCall("GET", api, "", HoursSCB, HoursECB);
}//כמה בקשות אושרו מתוך הסה"כ
function HoursSCB(data) {
    if (data.length == 0) {
        alert("לא קיימים נתונים עבור בניין זה")
    }
    else {
    // Group the data by section
    var sectionData = {};
    data.forEach(function (item) {
        for (var section in item) {
            if (!sectionData[section]) {
                sectionData[section] = [];
            }
            sectionData[section].push(item[section]);
        }
    });

    // Check if a chart with ID '0' already exists
    var existingChart = Chart.getChart("myHoursChart");
    if (existingChart) {
        existingChart.destroy();
    }

    // Create the chart
    var canvas2 = document.getElementById('myHoursChart');
    var ctx2 = canvas2.getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'bar', // Set the chart type to bar
        data: {
            labels: ['8-12', '12-3', '3-6', '6-9', 'After 9pm'],
            datasets: [{
                label: 'Total Hours',
                data: [
                    sectionData.section1.reduce((a, b) => a + b, 0), // Sum the values in each section to get the total hours
                    sectionData.section2.reduce((a, b) => a + b, 0),
                    sectionData.section3.reduce((a, b) => a + b, 0),
                    sectionData.section4.reduce((a, b) => a + b, 0),
                    sectionData.section5.reduce((a, b) => a + b, 0),
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
        }
}
function HoursECB() {
    console.log('Failed to retrieve data from the server');
}//כישלון


function GetBuilding() { //הוצאת כתובות 
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        api = "https://localhost:7006/adress";
    } else {
        api = "https://proj.ruppin.ac.il/cgroup44/prod/adress";
    }
    ajaxCall("GET", api, "", getAdressSCB,getAdressECB);
}//הוצאת כתובות
function getAdressSCB(data) {
    RenderAdress(data);
}//הצלחה
function getAdressECB(err) {
    alert("בעיה בשליפת כתובות הבניינים");
    console.log(err);
}//כישלון

function RenderAdress(data) {//מרנדר את שמות החניות של המשתמש לטופס
   
    var str = "<option id='0' value='כולם'></option>";
    if(Array.isArray(data)){
        for (let i = 0; i < data.length; i++) {
            str += "<option id='" + data[i].id + "'value='" + data[i].address + "'>";
        }
    } else {
        str += "<option id='" + data.id + '" value=' + data.address + "'>";
    }
   
    document.getElementById("cityDL").innerHTML = str;
    document.getElementById("cityDL2").innerHTML += str;
   
}//רינדור כתובות לפקד

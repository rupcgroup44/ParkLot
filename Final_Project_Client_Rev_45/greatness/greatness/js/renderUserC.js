$(document).ready(function () {

    updateSessionStorage();

    renderUser();

    $('#LogOTBTN').click(function () {//בלחיצה על כפתור התנתקות עבור לדף התחברות ורוקן את הסיזן סטורג
        sessionStorage.clear();
        window.location = "loginParkingPage.html";
    });

    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        apiUpDateC = "https://localhost:7006/api/User/UPDATE/coins";
    } else {
        apiUpDateC = "https://proj.ruppin.ac.il/cgroup44/prod/api/User/UPDATE/coins";
    }
    ajaxCall("PUT", apiUpDateC, "", UpdateSCB, UpdateECB); //עדכון מטבעות
});

function UpdateSCB(data) {
    console.log(data);
}

function UpdateECB(erro) {
    console.log(erro);
}

function updateSessionStorage(){ //שליפת מטבעות עדכנית מבסיס הנתונים ועדכון הסטורז סיזן
    const Details = sessionStorage.getItem('userLogin');
    const User = JSON.parse(Details);
    if (
        location.hostname == "localhost" ||
        location.hostname == "127.0.0.1" ||
        location.hostname == ""
    ) {
        apiForCoins = "https://localhost:7006/api/User/CurrentNumberOfCoins/";
    } else {
        apiForCoins = "https://proj.ruppin.ac.il/cgroup44/prod/api/User/CurrentNumberOfCoins/";
    }
    ajaxCall("GET", apiForCoins + User.email , "", GetCoinsNowSCB, GetCoinsNowECB); //שליפת מטבעות עדכנית
}

function GetCoinsNowSCB(data) { //עדכון שדה מטבעות באחסון המקומי
    coinsNew = data.coins
    // Retrieve the "userLogin" object from sessionStorage
    const userLoginJSON = sessionStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);

    // Update the "coins" field
    const updatedUserLogin = Object.assign({}, userLogin, { coins: coinsNew }); // Replace 100 with your desired value

    // Convert the updated object to a JSON string and store it back in sessionStorage
    const updatedUserLoginJSON = JSON.stringify(updatedUserLogin);
    sessionStorage.setItem('userLogin', updatedUserLoginJSON);

    console.log(data);
}

function GetCoinsNowECB(err){
    console.log(err);
}

function renderUser() {  //מרנדר את שם המשתמש והמטבעות

    const Details = sessionStorage.getItem('userLogin');

    // Parse the string to an object
    const User = JSON.parse(Details);

    // Retrieve the values from the object
    const firstName = User.firstName;
    const coins = User.coins;
    str = " <p id='p-User'>שלום, " + firstName + "  " + "<img id='coinsimage' src='images/Coins.png'/>" + coins + "</p>";
    str10 = "<button id='LogOTBTN'> <img src='images/logout.png'/>התנתקות</button>";
    document.getElementById("ShowUser").innerHTML = str;
    document.getElementById("LogOutDiv").innerHTML = str10;
}
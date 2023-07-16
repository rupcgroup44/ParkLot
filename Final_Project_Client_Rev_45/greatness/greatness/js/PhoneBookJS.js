
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
    showDataTable();

  
});
function showDataTable() { //שלוף את כל המשתמשים הקיימים
    var id = userData.idBuilding;
    ajaxCall("GET", api + "/" + id + "/getPhones/users","", getSuccess, error);
}

function getSuccess(usersdata) {//הצגה בטבלה
    $("#ph2").css({ "display": "block" });
    users = usersdata; // keep the cars array in a global variable;
    /*newUsres = AdminPublishing(users);*/
    try {
        tbl = $('#usersTable').DataTable({
            data:users,
            pageLength: 3,  //מראה עד 10 שורות בטבלה
            columns: [
                { data: "email" },
                { data: "firstname" },
                { data: "familyname" },
                { data: "phonenumber" },
            ],
        });
    }
    catch (err) {
        alert(err);
    }

    //////שינוי של הכתיבה החיצונית לטבלה
    $(document).ready(function () {
        $('#usersTable_length label').contents().filter(function () {
            return this.nodeType === 3;
        })[0].textContent = 'בחר כמות אנשי קשר להצגה : '; // Replace 'חיפוש' with the desired text
        $('#usersTable_length label').contents().filter(function () {
            return this.nodeType === 3;
        })[1].textContent = ''; // Remove 'Show' text
    });
    $(document).ready(function () {
        $('#usersTable_filter label').contents().filter(function () {
            return this.nodeType === 3;
        })[0].textContent = 'חיפוש: '; // Replace 'חיפוש' with the desired text
        const selectElement = document.querySelector('select[name="usersTable_length"]');
        selectElement.classList.add('form-control');
        const inputElement = document.querySelector('#usersTable_filter input[type="search"]');
        inputElement.classList.add('form-control');
  
    });
    $(document).ready(function () {
    const selectElement = document.querySelector('select[name="usersTable_length"]');
    const newOption = document.createElement('option');
    newOption.value = '1000';
    newOption.text = 'הצג הכל';
        selectElement.appendChild(newOption);
        const infoElement = document.querySelector('.dataTables_info');
        infoElement.style.display = 'none';
        const paginateElement = document.querySelector('.dataTables_paginate');
        paginateElement.style.display = 'none';
    });
  
}

function error(err) {// this function is activated in case of a failure
    swal("Error: " + err);
}
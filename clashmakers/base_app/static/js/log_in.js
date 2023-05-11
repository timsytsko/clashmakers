let psw_input_field = document.getElementById("psw_input");
let login_input_field = document.getElementById("login_input")
let signup_btn = document.getElementById("login_button");

function hide_psw_letters() {
    psw_input_field.type = "password";
}

function view_psw_letters() {
    psw_input_field.type = "text";
}

function login_input_to_normal() {
    login_input_field.style.borderColor = "#707070";
}

function psw_input_to_normal() {
    psw_input_field.style.borderColor = "#707070";
}

function sinup() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "login_user");

    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = () => {
        rec_data = xhr.response;
        login_exists = rec_data.login_exists
        psw_correct = rec_data.psw_correct
        if (login_exists && psw_correct) {
            document.cookie = "session_key=" + rec_data.session_key + ";path=/" + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
            document.cookie = "login=" + login_input_field.value + ";path=/" + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
            window.location.replace('/');
        } else {
            if (!login_exists) {
                login_input_field.placeholder = "Incorrect_login";
                login_input_field.value = '';
                login_input_field.style.borderColor = "#ff5733";
            }
            if (!psw_correct) {
                psw_input_field.placeholder = "Incorrect_passworrd";
                psw_input_field.value = '';
                psw_input_field.style.borderColor = "#ff5733";
            }
        }
    }
    
    let data = JSON.stringify({
        "login": login_input_field.value,
        "psw": psw_input_field.value
    });
    xhr.send(data);
}

psw_input_field.addEventListener("mouseout", hide_psw_letters);
psw_input_field.addEventListener("mouseover", view_psw_letters);
psw_input_field.addEventListener("click", psw_input_to_normal);
login_input_field.addEventListener("click", login_input_to_normal);
signup_btn.addEventListener("click", sinup)
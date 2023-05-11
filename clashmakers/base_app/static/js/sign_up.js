let psw_input_field = document.getElementById("psw_input");
let login_input_field = document.getElementById("login_input")
let signup_btn = document.getElementById("signup_button");


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
    xhr.open("POST", "add_user");

    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = () => {
        rec_data = xhr.response;
        login_correct = rec_data.correct_login
        psw_correct = rec_data.correct_psw
        login_plh = rec_data.login_plh
        psw_plh = rec_data.psw_plh
        if (login_correct && psw_correct) {
            window.location.replace('/');
        } else {
            if (!login_correct) {
                login_input_field.placeholder = login_plh;
                login_input_field.value = '';
                login_input_field.style.borderColor = "#ff5733";
            }
            if (!psw_correct) {
                psw_input_field.placeholder = psw_plh;
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
let btn_logout = document.getElementById("logout");

function get_cookie(name) {
    if (document.cookie.length > 0) {
        start = document.cookie.indexOf(name + "=");
        if (start != -1) {
            start = start + name.length + 1;
            end = document.cookie.indexOf(";", start);
            if (end == -1) {
                end = document.cookie.length;
            }
            return document.cookie.substring(start, end);
        }
    }
    return "no_cookie";
}

function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "logout_user");

    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = () => {
        document.cookie = "login= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "session_key= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        window.location.replace('/');
    }
    
    let data = JSON.stringify({
        "login": get_cookie('login')
    });
    xhr.send(data);
}

btn_logout.addEventListener("click", logout);
let user_name = document.createElement('p');
user_name.innerHTML = get_cookie('login');
document.getElementsByTagName('main')[0].appendChild(user_name)

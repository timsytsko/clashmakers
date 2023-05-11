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

function redirect_to_placing_bet_page(event_id) {
    window.location.href = 'place_bet?id=' + event_id;
}

function add_event_html(event) {
    let event_div = document.createElement('div');
    event_div.classList.add('event');

    let participants_div = document.createElement('div');
    participants_div.classList.add('participants');
    let participant_1 = document.createElement('p');
    participant_1.innerHTML = event.participant_1 + ':';
    let participant_2 = document.createElement('p');
    participant_2.innerHTML = event.participant_2;
    participants_div.appendChild(participant_1);
    participants_div.appendChild(participant_2);

    let score_div = document.createElement('score');
    score_div.classList.add('score');
    let score = document.createElement('p');
    score.innerHTML = event.score;
    score_div.appendChild(score);

    let date_div = document.createElement('div');
    date_div.classList.add('date');
    let date = document.createElement('p');
    date.innerHTML = event.start_time;
    date_div.appendChild(date);
    
    event_div.appendChild(participants_div);
    event_div.appendChild(score_div);
    event_div.appendChild(date_div);

    event_div.addEventListener('click', function() {
        redirect_to_placing_bet_page(event.self_id);
    });

    document.getElementsByTagName('main')[0].appendChild(event_div);
}

function add_events() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "get_events");

    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        rec_data = xhr.response;
        let events;
        events = rec_data.events;
        for (let i in events) {
            add_event_html(events[i]);
        }
    }
    xhr.send({});
}

let session_key = get_cookie("session_key");
let user_login = get_cookie("login");
if (session_key != "no_cookie") {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "check_session");

    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = () => {
        rec_data = xhr.response;
        if (rec_data.correct_session_key) {
            login_signup = document.getElementsByClassName("login_signup")[0];
            login_signup.removeChild(document.getElementById("signup"));
            login_signup.removeChild(document.getElementById("login"));
            new_link = document.createElement("a");
            new_link.href = "profile";
            new_img = document.createElement("img");
            new_img.src = "../../static/icons/man.svg";
            new_img.alt = "man_icon";
            new_link.appendChild(new_img);
            login_signup.appendChild(new_link);
        }
    }
    
    let data = JSON.stringify({
        "session_key": session_key,
        "user_login": user_login
    });
    xhr.send(data);
}
add_events();

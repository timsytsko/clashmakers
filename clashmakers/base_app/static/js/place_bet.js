function get_GET_value(key) {
    let params = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            var a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );
    return params[key];
}

let current_time = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});

function cmp_time(time_1_str, time_2_str) {
    let time_1 = time_1_str.split(' ');
    let time_2 = time_2_str.split(' ');
    time_1[0] = time_1[0].slice(0, -1).split('/');
    time_2[0] = time_2[0].slice(0, -1).split('/');
    inds = [2, 0, 1]
    for (let i of inds) {
        time_1[0][i] = Number(time_1[0][i]);
        time_2[0][i] = Number(time_2[0][i]);
        if (time_1[0][i] != time_2[0][i]) {
            return time_1[0][i] > time_2[0][i];
        }
    }
    time_1[1] = time_1[1].split(':');
    time_2[1] = time_2[1].split(':');
    if (time_1[2] != time_2[2]) {
        return time_1[2] == 'PM';
    }
    for (let i = 0; i < 3; i++) {
        time_1[1][i] = Number(time_1[1][i]);
        time_2[1][i] = Number(time_2[1][i]);
        if (time_1[1][i] != time_2[1][i]) {
            return time_1[1][i] > time_2[1][i];
        }
    }
    return false;
}

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

function add_bettor() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "add_bettor");
    
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = () => {
        rec_data = xhr.response;
        if (rec_data.success) {
            window.location.replace('/');
        } else {
            window.location.replace('message?q=' + rec_data.error);
        }
    }
    
    participant_1_score = document.getElementsByClassName('participant_1_score')[0]
    participant_2_score = document.getElementsByClassName('participant_2_score')[0]
    let data = JSON.stringify({
        "login": get_cookie('login'),
        "session_key": get_cookie('session_key'),
        "bettor_score": participant_1_score.innerHTML + ':' + participant_2_score.innerHTML,
        'event_id': get_GET_value('id')
    });
    xhr.send(data);
}

function draw_form() {
    let main = document.getElementsByTagName('main')[0];

    if (document.getElementsByClassName('bet_btn')[0].innerHTML != "Let's bet!") {
        return;
    }

    if (document.getElementsByClassName('bet_form').length != 0) {
        main.removeChild(document.getElementsByClassName('bet_form')[0]);
        return;
    }

    let bet_form = document.createElement('div');
    bet_form.classList.add('bet_form');

    let bet_input = document.createElement('div');
    bet_input.classList.add('bet_input');

    let participant_1_score = document.createElement('p');
    participant_1_score.classList.add('participant_1_score');
    participant_1_score.innerHTML = '0';
    let colon = document.createElement('p');
    colon.classList.add('colon');
    colon.innerHTML = ':';
    let participant_2_score = document.createElement('p');
    participant_2_score.classList.add('participant_2_score');
    participant_2_score.innerHTML = '0';

    bet_input.appendChild(participant_1_score);
    bet_input.appendChild(colon);
    bet_input.appendChild(participant_2_score);

    bet_form.appendChild(bet_input);

    let send_btn = document.createElement('button');
    send_btn.classList.add('send_btn');
    send_btn.innerHTML = 'Send!'
    
    bet_form.appendChild(send_btn);

    let tip = document.createElement('p');
    tip.classList.add('tip');
    tip.innerHTML = '* left click to increase, right to decrease';

    bet_form.appendChild(tip);
    
    main.appendChild(bet_form);

    participant_1_score.addEventListener('click', () => {
        let now = participant_1_score.innerHTML;
        let next = String(Number(now) + 1);
        participant_1_score.innerHTML = next;
    });
    participant_1_score.addEventListener('contextmenu', () => {
        event.preventDefault();
        let now = participant_1_score.innerHTML;
        if (now == 0) {
            return;
        }
        let next = String(Number(now) - 1);
        participant_1_score.innerHTML = next;
    });
    participant_2_score.addEventListener('click', () => {
        let now = participant_2_score.innerHTML;
        let next = String(Number(now) + 1);
        participant_2_score.innerHTML = next;
    });
    participant_2_score.addEventListener('contextmenu', () => {
        event.preventDefault();
        let now = participant_2_score.innerHTML;
        if (now == 0) {
            return;
        }
        let next = String(Number(now) - 1);
        participant_2_score.innerHTML = next;
    });
    send_btn.addEventListener('click', add_bettor);
}

function draw_event_bettors(event) {
    let main = document.getElementsByTagName('main')[0];

    let bettors_div = document.createElement('div');
    bettors_div.classList.add('bettors_div');

    let bettors_list = event.bettors.split(' ').slice(1);
    for (let i in bettors_list) {
        bettors_list[i] = bettors_list[i].split('-')[0];
    }
    
    let bettors = document.createElement('p');
    bettors.classList.add('bettors');
    let inner = "";
    if (bettors_list.length > 0) {
        inner += "Already placed a bet: ";
        if (bettors_list.length > 4) {
            inner += bettors_list.slice(0, 3).join(', ') + ', ' + bettors_list[3] + '...';
        } else {
            inner += bettors_list.join(', ') + ".";
        }
    }
    bettors.innerHTML = inner;

    bettors_div.appendChild(bettors);

    main.appendChild(bettors_div);
}

function draw_event(event) {
    let main = document.getElementsByTagName('main')[0];

    let event_info = document.createElement('div');
    event_info.classList.add('event_info');
    let participants = document.createElement('div');
    participants.classList.add('participants');
    let participant_1 = document.createElement('p');
    participant_1.innerHTML = event.participant_1;
    let participant_2 = document.createElement('p');
    participant_2.innerHTML = event.participant_2;
    participants.appendChild(participant_1);
    participants.appendChild(participant_2);
    event_info.appendChild(participants);

    let score_div = document.createElement('div');
    score_div.classList.add('score');
    let score = document.createElement('p');
    score.innerHTML = event.score;
    score_div.appendChild(score);
    event_info.appendChild(score_div);

    let date_div = document.createElement('div');
    date_div.classList.add('date');
    let date = document.createElement('p');
    score.innerHTML = event.start_time;
    date_div.appendChild(date);
    event_info.appendChild(date_div);

    main.appendChild(event_info);
    
    if (!cmp_time(event.start_time, current_time)) {
        return;
    }
    if (get_cookie('login') == 'no_cookie') {
        return;
    }
    let bettors_list = event.bettors.split(' ').slice(1);
    for (let i in bettors_list) {
        bettors_list[i] = bettors_list[i].split('-')[0];
    }
    if (bettors_list.indexOf(get_cookie('login')) != -1) {
        let have_placed_div = document.createElement('div');
        have_placed_div.classList.add('have_placed_div');

        let have_placed = document.createElement('p');
        have_placed.classList.add('have_placed');
        have_placed.innerHTML = "You have already placed a bet on this event!";

        have_placed_div.appendChild(have_placed);
        main.appendChild(have_placed_div);
        return;
    }

    let bet_btn_div = document.createElement('div');
    bet_btn_div.classList.add('bet_btn_div');
    let bet_btn = document.createElement('p');
    bet_btn.classList.add('bet_btn');
    bet_btn.innerHTML = "Let's bet!";
    bet_btn_div.appendChild(bet_btn);

    main.appendChild(bet_btn_div);

    
    bet_btn.addEventListener('click', draw_form);
}

let xhr = new XMLHttpRequest();
xhr.open("POST", "get_event_by_id");

xhr.responseType = "json";
xhr.setRequestHeader("Content-Type", "application/json");
    
xhr.onload = () => {
    rec_data = xhr.response;
    draw_event(rec_data.event);
    draw_event_bettors(rec_data.event);
}
    
let data = JSON.stringify({
    "event_id": get_GET_value('id')
});
xhr.send(data);

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

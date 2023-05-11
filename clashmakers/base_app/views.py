from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import users
from .models import sessions
from .models import events
import json
import random
import requests

def index(request):
    return render(request, "base_app/index.html")

def login(request):
    return render(request, "base_app/log_in.html")

def signup(request):
    return render(request, "base_app/sign_up.html")

def rules(request):
    return render(request, "base_app/rules.html")

@csrf_exempt
def add_user(request):
    def login_check(login):
        acces_chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', '.', "'", ';'];
        for c in range(65, 91):
            acces_chars.append(chr(c))
        for c in range(97, 123):
            acces_chars.append(chr(c))
        login_res = '+'
        if len(login) < 3:
            login_res = "Too_short"
        for c in login:
            if not c in acces_chars:
                login_res = "Wrong_characters"
        return login_res
    
    def psw_check(psw):
        acces_chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!', '"', '#',
                        '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':',
                        ';', '<', '=', '>','?', '@', '[', ']', '^', '`', '{', '|', '}', '~'];
        for c in range(65, 91):
            acces_chars.append(chr(c))
        for c in range(97, 123):
            acces_chars.append(chr(c))
        psw_res = '+'
        if len(psw) < 8:
            psw_res = "Too_short"
        for c in psw:
            if not c in acces_chars:
                psw_res = "Wrong_characters"
        return psw_res

    def alredy_exist(login):
        if login == 'admin':
            return True
        for logins in users.objects.all():
            if logins.name == login:
                return True
        return False
    
    data = json.loads(request.body.decode('utf-8'))

    value = [data['login'], data['psw']]
    exist = alredy_exist(value[0])
    login_correct = login_check(value[0])
    psw_correct = psw_check(value[1])
    if login_correct == '+' and psw_correct == '+' and not exist:
        users.objects.create(name=value[0], psw=value[1])
        argss = {
        'correct_login': True,
        'login_plh': '',
        'correct_psw': True,
        'psw_plh': ''
        }
        return JsonResponse(argss)
    else:
        login_plh = "Login"
        if login_correct != '+':
            login_plh = login_correct
        if exist:
            login_plh = "Login_exists"
        argss = {
        'correct_login': login_correct == '+' and not exist,
        'login_plh': login_plh,
        'correct_psw': psw_correct == '+' ,
        'psw_plh': "Password" if psw_correct == '+' else psw_correct
        }
        return JsonResponse(argss)

@csrf_exempt
def login_user(request):
    def create_session_key(len=10):
        chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        res = ''
        for _ in range(len):
            res += chars[random.randint(0, 35)]
        return res

    def find_user(login):
        for user in users.objects.all():
            if user.name == login:
                return user
        return -1

    data = json.loads(request.body.decode('utf-8'))

    value = [data['login'], data['psw']]
    user = find_user(value[0])
    if user == -1:
        argss = {
            'login_exists': False,
            'psw_correct': True,
            'session_key': ""
        }
        return JsonResponse(argss)
    else:
        if user.psw != value[1]:
            argss = {
                'login_exists': True,
                'psw_correct': False,
                'session_key': ""
            }
            return JsonResponse(argss)
        else:
            session_key = create_session_key()
            sessions.objects.create(key=session_key, user_login=value[0])
            argss = {
                'login_exists': True,
                'psw_correct': True,
                'session_key': session_key
            }
            return JsonResponse(argss)

@csrf_exempt
def check_session(request):
    data = json.loads(request.body.decode('utf-8'))
    session_key = data["session_key"]
    user_login = data["user_login"]
    res = False
    for session in sessions.objects.all():
        if session.user_login == user_login:
            if session.key == session_key:
                res = True
                break
    data = {
        "correct_session_key": res
    }
    return JsonResponse(data)

def profile(request):
    return render(request, "base_app/profile.html")

@csrf_exempt
def logout_user(request):
    data = json.loads(request.body.decode('utf-8'))
    login = data["login"]
    obj = sessions.objects.get(user_login=login)
    obj.delete()
    return JsonResponse({})

def place_bet(request):
    return render(request, "base_app/place_bet.html")

def get_events(request):
    data = []
    for event in events.objects.all():
        add_data = {
            'self_id': event.self_id,
            'start_time': event.start_time,
            'participant_1': event.participant_1,
            'participant_2': event.participant_2,
            'score': event.score
        }
        data.append(add_data)
    return JsonResponse({'events': data})

@csrf_exempt
def get_event_by_id(request):
    request_data = json.loads(request.body.decode('utf-8'))
    event_id = request_data['event_id']
    event = events.objects.get(self_id=event_id)
    data =  {
            'self_id': event.self_id,
            'start_time': event.start_time,
            'participant_1': event.participant_1,
            'participant_2': event.participant_2,
            'score': event.score,
            'bettors': event.bettors
        }
    return JsonResponse({'event': data})

@csrf_exempt
def add_bettor(request):
    request_data = json.loads(request.body.decode('utf-8'))
    bettor_login = request_data['login']
    bettor_session_key = request_data['session_key']
    bettor_score = request_data['bettor_score']
    event_id = request_data['event_id']
    event = events.objects.get(self_id=event_id)
    data = {}
    if sessions.objects.get(user_login=bettor_login).key == bettor_session_key:
        bettors = event.bettors
        add = ' ' + bettor_login + '-' + bettor_score
        bettors += add
        event.bettors = bettors
        event.save()
        data = {
            'success': True,
            'error': ''
        }
    else:
        data = {
            'success': False,
            'error': 'Incorrect_session_key!'
        }
    return JsonResponse(data)

def message(request):
    return render(request, "base_app/message.html")

def update_events(request):
    # TODO
    def cmp_time(time_1_str, time_2_str):
        ...
    
    def to_yyyyMMdd(time):
        ...
    
    url = "https://livescore6.p.rapidapi.com/matches/v2/list-by-date"
    for event in events.objects.all():
        date = to_yyyyMMdd(event.start_time)
        T1 = event.participant_1
        T2 = event.participant_2
        querystring = {"Category":"soccer", "Date":date, "Timezone":"3"}
        headers = {
	        "X-RapidAPI-Key": "2cd7ef402emsh81f02b9f49b2a6bp1fafcdjsn470b4e0447e9",
	        "X-RapidAPI-Host": "livescore6.p.rapidapi.com"
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        data = json.loads(response.text)['Stages']
        for league in data:
            fl = True
            for event in league['Events']:
                if event['T1'][0]['Nm'] == T1 and event['T2'][0]['Nm'] == T2:
                    print(event['Tr1'] + ':' + event['Tr2'])
                    fl = False
                    break
            if not fl:
                break

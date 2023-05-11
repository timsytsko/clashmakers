import datetime

def check_event_is_ended(event_time, cur_time):
    eventh = {}
    event_time = event_time.split()
    event_time[0] = event_time[0][:-1].split('/')
    eventh['d'] = event_time[0][1]
    eventh['mo'] = event_time[0][0]
    eventh['y'] = event_time[0][2]
    event_time[1] = event_time[1].split(':')
    if event_time[2] == 'PM':
        event_time[1][0] = str(int(event_time[1][0]) + 12)
    eventh['h'] = event_time[1][0]
    eventh['mi'] = event_time[1][1]
    eventh['s'] = event_time[1][2]

    curh = {}
    cur_time = cur_time.split()
    cur_time[0] = cur_time[0].split('-')
    curh['d'] = cur_time[0][2]
    curh['mo'] = cur_time[0][1]
    curh['y'] = cur_time[0][0]
    cur_time[1] = cur_time[1].split(':')
    curh['h'] = cur_time[1][0]
    curh['mi'] = cur_time[1][1]
    curh['s'] = cur_time[1][2]
    
    days_in_months = [
        0,
        31
    ]

    if eventh['mi'] >= '21':
        if eventh['d'] 
    
    inds = ['y', 'm', 'd']

curtime = str(datetime.datetime.now()).split('.')[0]
cmp_time("02/23/2023, 11:00:00 PM", '2023-02-23 12:01:22')
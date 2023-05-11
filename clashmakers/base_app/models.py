from django.db import models

class users(models.Model):
    name = models.CharField("name", max_length=50)
    psw = models.CharField("psw", max_length=50)
    #points = models.IntegerField("points")

    def __str__(self):
        return self.name

class sessions(models.Model):
    key = models.CharField("key", max_length=50)
    user_login = models.CharField("user_login", max_length=50)

    def __str__(self):
        return self.user_login

class events(models.Model):
    self_id = models.CharField("self_id", max_length=10)
    start_time = models.CharField("start_time", max_length=30)
    participant_1 = models.CharField("participant_1", max_length=30)
    participant_2 = models.CharField("participant_2", max_length=30)
    score = models.CharField(max_length=7)
    bettors = models.CharField('bettors', max_length=1000)

    def __str__(self):
        return self.self_id
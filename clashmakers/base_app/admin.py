from django.contrib import admin
from .models import users
from .models import sessions
from .models import events

admin.site.register(users)
admin.site.register(sessions)
admin.site.register(events)
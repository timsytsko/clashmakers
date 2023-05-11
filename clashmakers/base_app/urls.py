from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="home"),
    path('login', views.login, name="login"),
    path('signup', views.signup, name="signup"),
    path('rules', views.rules, name="rules"),
    path('add_user', views.add_user, name="add_user"),
    path('login_user', views.login_user, name="login_user"),
    path('check_session', views.check_session, name="check_session"),
    path('profile', views.profile, name="profile"),
    path('logout_user', views.logout_user, name="logout_user"),
    path('place_bet', views.place_bet, name="place_bet"),
    path('get_events', views.get_events, name="get_events"),
    path('get_event_by_id', views.get_event_by_id, name="get_event_by_id"),
    path('add_bettor', views.add_bettor, name='add_bettor'),
    path('message', views.message, name='message')
]
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT )
from django.urls import path
from . import views

urlpatterns = [
    path('incidents/', views.get_incidents, name='get_incidents'),
    path('resources/', views.get_resources, name='get_resources'),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, ProjectViewSet, JournalEntryViewSet, ServiceViewSet
from .auth_views import login, current_user

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'files', FileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'journal-entries', JournalEntryViewSet)
router.register(r'services', ServiceViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints that mimic Directus API
    path('auth/login', login, name='auth_login'),
    path('users/me', current_user, name='current_user'),
]

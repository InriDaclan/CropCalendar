from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    api_login,
    api_register,
    api_me,
    dashboard_stats,
    interactive_weather,
    CategoryViewSet,
    CropViewSet,
    UserCropScheduleViewSet,
    CropReviewViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'schedules', UserCropScheduleViewSet, basename='schedule')
router.register(r'reviews', CropReviewViewSet, basename='review')

urlpatterns = [
    path('auth/login/', api_login, name='api-login'),
    path('auth/register/', api_register, name='api-register'),
    path('auth/me/', api_me, name='api-me'),
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('weather/', interactive_weather, name='interactive-weather'),
    path('', include(router.urls)),
]

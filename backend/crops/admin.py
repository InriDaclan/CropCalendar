from django.contrib import admin
from .models import Category, Crop, UserCropSchedule

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'growth_days', 'season', 'difficulty', 'sunlight', 'watering')
    list_filter = ('category', 'season', 'difficulty', 'sunlight', 'watering')
    search_fields = ('name', 'scientific_name', 'description')
    ordering = ('growth_days', 'name')

@admin.register(UserCropSchedule)
class UserCropScheduleAdmin(admin.ModelAdmin):
    list_display = ('user', 'crop', 'planted_date', 'estimated_harvest_date', 'quantity', 'status')
    list_filter = ('status', 'planted_date')
    search_fields = ('user__username', 'crop__name', 'plot_location', 'notes')

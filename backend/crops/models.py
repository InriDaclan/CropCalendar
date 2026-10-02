from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='Leaf')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Crop(models.Model):
    SEASON_CHOICES = [
        ('Spring', 'Spring'),
        ('Summer', 'Summer'),
        ('Autumn', 'Autumn'),
        ('Winter', 'Winter'),
        ('All Season', 'All Season'),
    ]
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    SUNLIGHT_CHOICES = [
        ('Full Sun', 'Full Sun (6+ hrs)'),
        ('Partial Shade', 'Partial Shade (3-6 hrs)'),
        ('Full Shade', 'Full Shade'),
    ]
    WATERING_CHOICES = [
        ('Low', 'Low'),
        ('Moderate', 'Moderate'),
        ('High', 'High'),
    ]

    name = models.CharField(max_length=150)
    scientific_name = models.CharField(max_length=150, blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='crops')
    growth_days = models.PositiveIntegerField(help_text='Total days from planting to harvest')
    image_url = models.URLField(max_length=500, blank=True, default='')
    description = models.TextField()
    season = models.CharField(max_length=20, choices=SEASON_CHOICES, default='Spring')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='Easy')
    sunlight = models.CharField(max_length=30, choices=SUNLIGHT_CHOICES, default='Full Sun')
    watering = models.CharField(max_length=20, choices=WATERING_CHOICES, default='Moderate')
    germination_days = models.PositiveIntegerField(default=7, help_text='Days for seeds to sprout')
    spacing_cm = models.PositiveIntegerField(default=30, help_text='Spacing between plants in cm')
    harvest_window_days = models.PositiveIntegerField(default=14, help_text='Duration in days harvest remains viable')
    planting_tips = models.TextField(blank=True, default='')
    companion_plants = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.growth_days} days)'


class UserCropSchedule(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('growing', 'Growing'),
        ('ready', 'Ready to Harvest'),
        ('harvested', 'Harvested'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_schedules')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='schedules')
    planted_date = models.DateField(help_text='Date planted or planned to be planted')
    estimated_harvest_date = models.DateField(blank=True, null=True, help_text='Calculated based on crop growth days')
    quantity = models.PositiveIntegerField(default=1)
    plot_location = models.CharField(max_length=100, default='Plot A')
    notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['planted_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.estimated_harvest_date and self.planted_date and self.crop:
            self.estimated_harvest_date = self.planted_date + timedelta(days=self.crop.growth_days)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} - {self.crop.name} - Planted: {self.planted_date}'


class CropReview(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_reviews')
    rating = models.PositiveSmallIntegerField(default=5)
    review_text = models.TextField()
    growth_outcome = models.CharField(max_length=50, default='Bountiful Harvest')
    actual_days_taken = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} review for {self.crop.name} ({self.rating} stars)'

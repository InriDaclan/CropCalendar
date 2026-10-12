from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Avg
from .models import Category, Crop, UserCropSchedule, CropReview

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser']


class CategorySerializer(serializers.ModelSerializer):
    crop_count = serializers.IntegerField(source='crops.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'crop_count']


class CropReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CropReview
        fields = [
            'id',
            'crop',
            'user',
            'username',
            'rating',
            'review_text',
            'growth_outcome',
            'actual_days_taken',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class CropSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    reviews = CropReviewSerializer(many=True, read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Crop
        fields = [
            'id',
            'name',
            'scientific_name',
            'category',
            'category_name',
            'growth_days',
            'image_url',
            'description',
            'season',
            'difficulty',
            'sunlight',
            'watering',
            'germination_days',
            'spacing_cm',
            'harvest_window_days',
            'planting_tips',
            'companion_plants',
            'reviews',
            'avg_rating',
            'review_count',
            'created_at',
            'updated_at'
        ]

    def get_avg_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 5.0

    def get_review_count(self, obj):
        return obj.reviews.count()


class UserCropScheduleSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    crop_id = serializers.PrimaryKeyRelatedField(
        queryset=Crop.objects.all(), source='crop', write_only=True
    )
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserCropSchedule
        fields = [
            'id',
            'user',
            'user_username',
            'crop_id',
            'crop_details',
            'planted_date',
            'estimated_harvest_date',
            'quantity',
            'plot_location',
            'notes',
            'status',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

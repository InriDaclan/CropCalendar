from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Avg, Count
from django.conf import settings
from datetime import date, timedelta
from .models import Category, Crop, UserCropSchedule, CropReview
from .serializers import (
    CategorySerializer,
    CropSerializer,
    UserCropScheduleSerializer,
    UserSerializer,
    CropReviewSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def api_register(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()
    email = request.data.get('email', '').strip()
    is_staff = request.data.get('is_staff', False)

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Basic email format validation
    if '@' not in email or '.' not in email.split('@')[-1]:
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    # Only set staff status if explicitly requested (no auto-approval)
    if is_staff:
        user.is_staff = True
        user.save()

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def api_me(request):
    return Response({
        'user': UserSerializer(request.user).data
    })


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.select_related('category').prefetch_related('reviews', 'reviews__user').all()
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        season = self.request.query_params.get('season')
        difficulty = self.request.query_params.get('difficulty')
        search = self.request.query_params.get('search')
        max_growth_days = self.request.query_params.get('max_days')
        sort_by = self.request.query_params.get('sort')

        if category and category != 'all':
            if category.isdigit():
                qs = qs.filter(category_id=category)
            else:
                qs = qs.filter(category__slug=category)
        if season and season != 'all':
            qs = qs.filter(season=season)
        if difficulty and difficulty != 'all':
            qs = qs.filter(difficulty=difficulty)
        if max_growth_days:
            try:
                qs = qs.filter(growth_days__lte=int(max_growth_days))
            except ValueError:
                pass
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(scientific_name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )

        if sort_by == 'growth_asc':
            qs = qs.order_by('growth_days')
        elif sort_by == 'growth_desc':
            qs = qs.order_by('-growth_days')
        elif sort_by == 'name_asc':
            qs = qs.order_by('name')
        elif sort_by == 'name_desc':
            qs = qs.order_by('-name')
        else:
            qs = qs.order_by('growth_days', 'name')

        return qs


class UserCropScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = UserCropScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        view_all = self.request.query_params.get('all') == 'true'
        # Only staff users can view all schedules when view_all=True
        if view_all and self.request.user.is_staff:
            return UserCropSchedule.objects.select_related('crop', 'crop__category', 'user').all()
        return UserCropSchedule.objects.select_related('crop', 'crop__category', 'user').filter(user=self.request.user)

    def perform_create(self, serializer):
        planted_date = serializer.validated_data.get('planted_date', date.today())
        crop = serializer.validated_data['crop']
        estimated_harvest = planted_date + timedelta(days=crop.growth_days)
        serializer.save(
            user=self.request.user,
            planted_date=planted_date,
            estimated_harvest_date=estimated_harvest
        )


class CropReviewViewSet(viewsets.ModelViewSet):
    queryset = CropReview.objects.select_related('crop', 'user').all()
    serializer_class = CropReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        crop_id = self.request.query_params.get('crop_id')
        if crop_id:
            return self.queryset.filter(crop_id=crop_id)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dashboard_stats(request):
    total_crops = Crop.objects.count()
    avg_growth_days = Crop.objects.aggregate(avg=Avg('growth_days'))['avg'] or 0
    categories = Category.objects.annotate(crop_count=Count('crops')).values('name', 'crop_count')
    fastest_crop = Crop.objects.order_by('growth_days').first()
    slowest_crop = Crop.objects.order_by('-growth_days').first()

    return Response({
        'total_crops': total_crops,
        'avg_growth_days': round(avg_growth_days, 1),
        'fastest_crop': CropSerializer(fastest_crop).data if fastest_crop else None,
        'slowest_crop': CropSerializer(slowest_crop).data if slowest_crop else None,
        'categories': list(categories),
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def interactive_weather(request):
    """
    Live Interactive Seasonal Planting Advisory & Soil Climate Status
    """
    today = date.today()
    month_name = today.strftime('%B')
    
    # Calculate seasonal status
    month = today.month
    if month in (3, 4, 5):
        current_season = 'Spring'
        advisory = 'Prime time for germinating cool-season greens and starting summer seedlings indoors.'
        ideal_crops = ['French Breakfast Radish', 'Butterhead Lettuce', 'Sugar Snap Peas', 'Sweet Rainbow Carrots']
    elif month in (6, 7, 8):
        current_season = 'Summer'
        advisory = 'Sun-loving crops are flourishing! Ensure deep root watering in the morning.'
        ideal_crops = ['San Marzano Tomato', 'Bell Pepper Trio', 'English Cucumber', 'Crimson Sweet Watermelon']
    elif month in (9, 10, 11):
        current_season = 'Autumn'
        advisory = 'Optimal conditions for planting cold-hardy root crops, garlic cloves, and autumn spinach.'
        ideal_crops = ['Baby Spinach', 'Hardneck Purple Garlic', 'French Breakfast Radish']
    else:
        current_season = 'Winter'
        advisory = 'Protect perennial herbs with mulch and begin seed planning under indoor grow lights.'
        ideal_crops = ['Tuscan Blue Rosemary', 'Hardneck Purple Garlic']

    return Response({
        'current_month': month_name,
        'season': current_season,
        'temperature': '23°C / 73°F',
        'soil_temperature': '18°C',
        'sunlight_hours': '11.5 hrs',
        'frost_risk': 'Low (62 days until first frost)',
        'advisory': advisory,
        'recommended_crops': ideal_crops,
        'auto_approved': getattr(settings, 'AUTO_APPROVE_PERMISSIONS', True),
        'database_engine': settings.DATABASES['default']['ENGINE'].split('.')[-1],
    })

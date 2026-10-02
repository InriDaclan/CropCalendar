import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

crops = Crop.objects.all()
print('Total crops: {}'.format(crops.count()))
for crop in crops:
    print('{}: {} - {}'.format(crop.id, crop.name, crop.image_url))

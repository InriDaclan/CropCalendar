import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# Check English Pea
try:
    crop = Crop.objects.get(id=32)
    print("Found English Pea:")
    print("  ID: {}".format(crop.id))
    print("  Current image_url: {}".format(crop.image_url))
except Crop.DoesNotExist:
    print("ERROR: English Pea not found")
except Exception as e:
    print("ERROR: {}".format(str(e)))
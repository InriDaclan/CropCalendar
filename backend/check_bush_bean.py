import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# Check Bush Bean (Provider)
try:
    crop = Crop.objects.get(name='Bush Bean (Provider)')
    print("Found Bush Bean (Provider):")
    print("  ID: {}".format(crop.id))
    print("  Current image_url: {}".format(crop.image_url))
except Crop.DoesNotExist:
    print("ERROR: Bush Bean (Provider) not found")
except Exception as e:
    print("ERROR: {}".format(str(e)))
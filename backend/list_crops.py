import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# List all crops ordered by ID
crops = Crop.objects.all().order_by('id')
print("ID | Name")
print("---|----")
for crop in crops:
    print("{} | {}".format(crop.id, crop.name))
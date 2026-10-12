import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# Update Acorn Squash (ID 69) with new image URL
try:
    crop = Crop.objects.get(id=69)
    print("Current image_url for Acorn Squash (ID 69): {}".format(crop.image_url))
    
    # New image URL from Pexels
    new_image_url = "https://images.pexels.com/photos/34150195/pexels-photo-34150195.jpeg?cs=srgb&dl=pexels-jasmin-kaemmerer-704618493-34150195.jpg&fm=jpg"
    
    crop.image_url = new_image_url
    crop.save()
    
    print("Updated image_url for Acorn Squash (ID 69): {}".format(crop.image_url))
    print("SUCCESS: Image URL updated")
except Crop.DoesNotExist:
    print("ERROR: Crop with ID 69 not found")
except Exception as e:
    print("ERROR: {}".format(str(e)))

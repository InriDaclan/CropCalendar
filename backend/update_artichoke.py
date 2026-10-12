import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# Update Artichoke (ID 96) with new image URL
try:
    crop = Crop.objects.get(id=96)
    print("Current image_url for Artichoke (ID 96): {}".format(crop.image_url))
    
    # New image URL from Pexels
    new_image_url = "https://images.pexels.com/photos/36237950/pexels-photo-36237950.jpeg"
    
    crop.image_url = new_image_url
    crop.save()
    
    print("Updated image_url for Artichoke (ID 96): {}".format(crop.image_url))
    print("SUCCESS: Image URL updated")
except Crop.DoesNotExist:
    print("ERROR: Crop with ID 96 not found")
except Exception as e:
    print("ERROR: {}".format(str(e)))

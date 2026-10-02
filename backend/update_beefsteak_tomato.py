import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# Update Beefsteak Tomato (ID 66) with new image URL
try:
    crop = Crop.objects.get(id=66)
    print("Current image_url for Beefsteak Tomato (ID 66): {}".format(crop.image_url))
    
    # New image URL from Pexels (constructed from search results)
    new_image_url = "https://images.pexels.com/photos/5056828/pexels-photo-5056828.jpeg"
    
    crop.image_url = new_image_url
    crop.save()
    
    print("Updated image_url for Beefsteak Tomato (ID 66): {}".format(crop.image_url))
    print("SUCCESS: Image URL updated")
except Crop.DoesNotExist:
    print("ERROR: Crop with ID 66 not found")
except Exception as e:
    print("ERROR: {}".format(str(e)))

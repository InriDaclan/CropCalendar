import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cropcalendar_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Now import and use models
from crops.models import Crop

# Update Bartlett Pear (ID 39) with new image URL
try:
    crop = Crop.objects.get(id=39)
    print("Current image_url for Bartlett Pear (ID 39): {}".format(crop.image_url))
    
    # New image URL from Pexels
    new_image_url = "https://images.pexels.com/photos/7636165/pexels-photo-7636165.jpeg?cs=srgb&dl=pexels-shliftik-7636165.jpg&fm=jpg"
    
    crop.image_url = new_image_url
    crop.save()
    
    print("Updated image_url for Bartlett Pear (ID 39): {}".format(crop.image_url))
    print("SUCCESS: Image URL updated")
except Crop.DoesNotExist:
    print("ERROR: Crop with ID 39 not found")
except Exception as e:
    print("ERROR: {}".format(str(e)))

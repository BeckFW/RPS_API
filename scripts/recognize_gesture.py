import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from PIL import Image
from io import BytesIO
import sys

model_path = './models/gesture_recognizer_rps.task'

base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.GestureRecognizerOptions(base_options=base_options)
recognizer = vision.GestureRecognizer.create_from_options(options) 

# Get the image
try:
    image = BytesIO(sys.argv[1].encode())
    image_to_process = mp.Image.create_from_file(image)
except Exception as e: 
    print("Image Exception: ", e)
# Process the image
try:
    result = recognizer.recognize(image_to_process)
    print(result.gestures[0][0].category_name)
except Exception as e:
    print("Exception: ", e)
# Return result

sys.stdout.flush()

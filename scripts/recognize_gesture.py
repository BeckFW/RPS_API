import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from PIL import Image
from io import BytesIO
import numpy as np
import sys

# Rock Paper Scissors model for mediapipe
model_path = './models/gesture_recognizer_rps.task'

# MediaPipe Variables
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.GestureRecognizerOptions(base_options=base_options)
recognizer = vision.GestureRecognizer.create_from_options(options) 

## Access and Format Image ## 
try: 
    # Get the buffer from stdin
    image_buffer = np.asarray(sys.stdin.buffer.read())
    #print(image_buffer)
    # convert to an image
    image = Image.open(BytesIO(image_buffer))

    # format into mediapipe image class
    image_to_process = mp.Image(
        image_format=mp.ImageFormat.SRGBA, data=np.asarray(image))   
    
except Exception as e: 
    print("Exception:", e)

## Process the Image ##
try:
    # Run gesture recognizer
    result = recognizer.recognize(image_to_process)

    # Send result back to Node.js
    print(str(result.gestures[0][0].category_name))

except Exception as e:
    print("Exception: ", e)

# Ensure any results are sent back by flushing stdout
sys.stdout.flush()

const express = require("express");
const sharp = require("sharp");
const bodyParser = require("body-parser"); 
const mediaPipe = require("@mediapipe/tasks-vision");
const router = express.Router();


const setupVision = async () => {
    const vision = await mediaPipe.FilesetResolver.forVisionTasks(
        // WASM path
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    ); 
    return vision; 
}

const setupGestureRec = async (vision) => {
    const gestureRecognizer = await mediaPipe.GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "./models/gesture_recognizer_rps.task"
      },
      numHands: 2, 
    });

    return gestureRecognizer;
}

const processImage = async (image) => {
    const vision = await setupVision(); 
    const gestureRecognizer = await setupGestureRec(vision);

    const result = gestureRecognizer.recognize(image); 

    console.log('Gesture Recogniser Result: ');
    console.log(result); 
}

router.get("/", (req, res) => {
    // Return all available moves
    res.json("This API will recognise relevant hand gestures in images."); 
});

router.post("/",
    bodyParser.raw({ type: "image/png", limit: "5mb" }),
 (req, res) => {
 console.log(req.body);
 res.sendStatus(200);
 });

// POST endpoint to handle image upload and processing
router.post('/recognise',
    bodyParser.raw({type: 'image/png', limit: '5mb'}), 
    async (req, res) => {

    // Result of processing 
    let result = ""; 

    if (!req.body) {
      console.log('No image');
      return res.status(400).send('No image provided.');
    }

    // Process the uploaded image
    try {
      const processedImageBuffer = await sharp(req.body); 
      const jpegBuffer = await processedImageBuffer.jpeg().toBuffer();

      // Process with mediaPipe (may need to reformat again)
      result = await processImage(jpegBuffer); 
      // find result

      // Return the processed result
      return res.status(200).json({ result: 'OK' });
    } catch (error) {
      console.error('Error processing image:', error);
      return res.status(500).send('Error processing image.');
    }
  });


module.exports ={ 
    router, 
}
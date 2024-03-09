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

// Promise to run a python script. print() resolves, exceptions reject // 
const runPython = (image, scriptName) => {

    try {
        return new Promise((resolve, reject) => {
            const { spawn } = require("child_process"); 
            const pyScript = spawn('python3', [`./scripts/${scriptName}.py`, image]); 

            pyScript.stdout.on('data', (data) => {
                resolve(data); 
            }); 

            /*
            pyScript.stderr.on('data', (data) => {
                reject(data);
            }); 
            */
        });
    } catch (error) {
        console.log(error); 
    }
}

router.get("/", (req, res) => {
    // Return API Info
    res.json("This API can recognise hand gestures relevant for Rock Paper Scissors from a still image.");
});

router.post("/", bodyParser.raw({ type: "image/png", limit: "5mb" }), async (req, res) => {

    if (!req.body) {
        console.log("Missing Image"); 
        res.status(400).send("Missing Image");
    }

    console.log("Image Received"); 
    console.log(req.body);

    const processedImageBuffer = await sharp(req.body); 
    const jpegBuffer = await processedImageBuffer.toBuffer()

    runPython(processedImageBuffer, "recognize_gesture")
        .then((result) => {
            console.log(result.toString()); 
            res.status(200).send(result.toString()); 
        })
        .catch((err) => {
            console.log("Promise rejected");
            res.status(500).send(`Error: ${err.toString()}`);
        })
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
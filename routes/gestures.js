const express = require("express");
const bodyParser = require("body-parser"); 
const router = express.Router();

// Promise to run a python script. print() resolves, exceptions reject // 
const runPython = (image, scriptName) => {

    try {
        return new Promise((resolve, reject) => {
            const { spawn } = require("child_process"); 

            // Create python as child process
            const pyScript = spawn('python3', [`./scripts/${scriptName}.py`, {
                stdio: ['pipe', 'inherit', 'inherit', 'ipc'] // to pass in image buffer
            }]); 

            // Start writing to stdin, send image buffer
            pyScript.stdin.write(image);

            // Close stdin
            pyScript.stdin.end();

            // Read any messages from stdout (print)
            pyScript.stdout.on('data', (data) => {
                resolve(data); 
            }); 

            // Read any errors and reject promise
            pyScript.stderr.on('data', (data) => {
                reject(data);
            }); 
            
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
 });

// POST endpoint to handle image upload and processing
router.post('/recognise',
    bodyParser.raw({type: 'image/png', limit: '5mb'}), 
    async (req, res) => {

    // Result of processing 
    //let result = ""; 

    if (!req.body) {
      console.log('No image');
      return res.status(400).send('No image provided.');
    }

    // Process the uploaded image
    try {
        console.log("Image received");

        // Open the image buffer from request
        const imageBuffer = Buffer.from(req.body, 'binary');
        
        // Start python process via Promise and pass image buffer
        runPython(imageBuffer, "recognize_gesture")
            .then((result) => {
                console.log(result.toString()); 
                res.status(200).send(result.toString()); 
            })
            .catch((err) => {
                console.log("Promise rejected");
                res.status(500).send(`Error: ${err.toString()}`);
            });

    } catch (error) {
      console.error('Error processing image:', error);
      return res.status(500).send('Error processing image.');
    }
  });


module.exports ={ 
    router, 
}
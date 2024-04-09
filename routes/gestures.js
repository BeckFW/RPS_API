const express = require("express");
const bodyParser = require("body-parser"); 
const router = express.Router();

// Promise to run a python script. print() resolves, exceptions reject // 
const runPython = (image, scriptName) => {
    console.log('Running Python');
    //console.log('Image: ', image)
    try {
        return new Promise((resolve, reject) => {
            const { spawn } = require("child_process"); 

            // Create python as child process
            const pyScript = spawn('python3', [`/app/scripts/${scriptName}.py`, {
                stdio: ['pipe', 'inherit', 'inherit', 'ipc'] // to pass in image buffer
            }]); 

            // Start writing to stdin, send image buffer
            pyScript.stdin.write(image);

            // Close stdin
            pyScript.stdin.end();

            // Read any messages from stdout (print)
            pyScript.stdout.on('data', (data) => {
                // Handle python output
                console.log(data.toString());
                if (data.toString().includes("move:")) {
                    resolve(data.toString().split("move: ")[1]);
                } else if (data.toString().includes("Exception")) {
                    reject(data.toString());
                }
                // resolve(data); 
            }); 

            // Read any errors and reject promise
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
 });

// POST endpoint to handle image upload and processing
router.post('/recognise',
    bodyParser.raw({type: 'image/png', limit: '5mb'}), 
    async (req, res) => {

    const image = req.body;
    // Result of processing 
    //let result = ""; 

    if (!req.body) {
      console.log('No image');
      return res.status(400).send('No image provided.');
    }

    // Process the uploaded image
    try {
        console.log("Image received");
        //console.log(image);

        
        // Open the image buffer from request
        const imageBuffer = Buffer.from(image, 'binary');

        //console.log(imageBuffer);
        
        // Start python process via Promise and pass image buffer
        runPython(imageBuffer, "recognize_gesture")
            .then((result) => {
                const resultString = result.toString();
                console.log(resultString);

                if (resultString.startsWith("Exception", 0)) {
                    throw "MP Exception: " + resultString;  //.split(':')[1];
                }

                res.status(200).send(resultString); 
            })
            .catch((err) => {
                console.log("Promise rejected");
                console.log(err);
                res.status(500).send('Error: ' + err);
            });

    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
  });


module.exports ={ 
    router, 
}
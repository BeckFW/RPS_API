// Rock Paper Scissors API // 

const express = require("express"); 
const cors = require("cors"); 
const app = express(); 

// Environment Variables //
const PORT = process.env.PORT || 3200; 
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const API_KEY = process.env.API_KEY;

// {} import due to multiple exports from routes
const  { router: move } = require('./routes/move');
const { router: gestures } = require('./routes/gestures');

// Allow local origin through cors
app.use(cors({origin: ORIGIN}));

// Check all routes for an API key held as an environment variable
app.use((req, res, next) => {
    if (req.headers['api-key'] !== API_KEY) {
        res.status(401).send("Not authorised");
    } else {
        next();
    }
});

app.use('/gestures', gestures);
app.use('/moves', move); 

app.listen(PORT, ()=>{
    console.log(`RPS API Running on Port ${PORT}`); 
    console.log("Available Routes: /moves, /gestures"); 
}); 
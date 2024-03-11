// Rock Paper Scissors API // 

const express = require("express"); 
const cors = require("cors"); 
const app = express(); 
const PORT = process.env.PORT || 3100; 

// {} import due to multiple exports from move.js
const  { router: move } = require('./routes/move');
const { router: gestures } = require('./routes/gestures');

// Allow local origin through cors
app.use(cors({origin: 'http://localhost:3000'}));

app.use('/gestures', gestures);
app.use('/moves', move); 

app.listen(PORT, ()=>{
    console.log(`RPS API Running on Port ${PORT}`); 
    console.log("Available Routes: /moves, /gestures"); 
}); 
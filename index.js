// Rock Paper Scissors API // 

const express = require("express"); 
const app = express(); 
const PORT = process.env.PORT || 3100; 

// {} import due to multiple exports from move.js
const  { router: move } = require('./routes/move');
const { router: gestures } = require('./routes/gestures');

app.use('/gestures', gestures);
app.use('/moves', move); 

app.listen(PORT, ()=>{
    console.log(`RPS API Running on Port ${PORT}`); 
    console.log("Available Routes: /moves, /gestures"); 
}); 
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();


// Init Application
const app = express();


// Connect Database
connectDB();


// Init bodyParser middleware
// app.use(express.json({extended : false}));
app.use(express.json());


// Define Routes
app.use('/api/planes',require('./routes/planes'));


// Serve Static Assets if in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    } )
}

const PORT = process.env.PORT || 5000 ;

app.listen(PORT,() => console.log(`Server Started on port ${PORT} `));
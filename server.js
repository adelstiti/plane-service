const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();


// Init Application
const app = express();


// Connect Database
connectDB();


// Init bodyParser middleware
app.use(express.json());

// Define Routes
app.use('/api/planes',require('./routes/planes'));


// Home Route
app.get('/',(req,res) => {
    res.status(200).json(
        {
            msg:'Welcome to the Plane API', 
            version: '1.0.0', 
            author: 'Adel Stiti', 
            email: 'adelstiti@gmail.com'
        }
    );
});

const PORT = process.env.PORT || 5000 ;

app.listen(PORT,() => console.log(`Server Started on port ${PORT} `));
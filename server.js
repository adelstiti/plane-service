const express = require('express');
const connectDB = require('./config/db');
const eurekaHelper = require('./helpers/eureka');

require('dotenv').config();


// Init Application
const app = express();


// Connect Database
connectDB();


// Init bodyParser middleware
app.use(express.json());

// Add response api helper
app.use(function(req, res, next) {
    /**
     * Return Response Api.
     *
     * @param int    status   status
     * @param array  userData userData
     * @param string msg      msg
     * @param array  errors   errors
     *
     * @return JSON
     */
    res.responseApiReturn = function (status, data = [], msg = 'OK', errors = []) {
        const response = {
            'base_url' : req.protocol + '://' + req.get('host') + req.originalUrl,
            'status' : (200 == status) ? true : false,
            'message' : msg,
        };

        if (200 != status) {
            response['status_code'] = status;
        }

        if (data) {
            response['data'] = data;
        }

        if (errors) {
            response['errors'] = errors;
        }

        res.status(status).json(response);
    }
  
    next() 
})

// Define Routes
app.use('/api/planes',require('./routes/planes'));


// Home Route
app.get('/',(req,res) => {
    res.responseApiReturn(200,{
            version: '1.0.0', 
            author: 'Adel Stiti', 
            email: 'adelstiti@gmail.com'
        },
        'Welcome to the Plane API'
    );
});

const PORT = process.env.PORT || 5000 ;

eurekaHelper.registerWithEureka('plane-service', PORT);

app.listen(PORT,() => console.log(`Server Started on port ${PORT} `));
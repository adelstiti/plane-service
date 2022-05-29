const mongoose = require('mongoose');


// Connect Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flightReservation')

        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);

    }

};

module.exports = connectDB;
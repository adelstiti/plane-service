const  mongoose = require("mongoose");

const PlaneSchema = mongoose.Schema(
    {
        name : {
            type : String ,
            require : true 
        },
        code : {
            type : String,
            require : true,
            unique : true
        },
        model : {
            type : String,
            require : true,
            lowercase: true
        },
        capacity : {
            type : Number,
            require : true,
        },
        airline : {
            type : String,
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('plane',PlaneSchema)
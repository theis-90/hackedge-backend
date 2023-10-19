const mongoose = require("mongoose");
 
 

const devcieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: false,
        trim: true,
    },
    detail: {
        type: String,
        required: false,
        trim: true,
    },

}, {
    timestamps: true
});





mongoose.model('Device', devcieSchema);    

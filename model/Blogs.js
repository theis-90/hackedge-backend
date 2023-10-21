const mongoose = require("mongoose");
    


const blogSchema = new mongoose.Schema({
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





mongoose.model('Blogs', blogSchema);    

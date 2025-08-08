const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    description: {
        type: String
    },
    userId: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    isDelete: {
        type: Boolean
    }
}, { timestamps: true });
module.exports = mongoose.model('newuser', PostSchema);



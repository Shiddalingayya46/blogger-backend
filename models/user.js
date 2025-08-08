const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // lowercase: true,
        // trim: true,
        // match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }, 
    isValid: {
        type: Boolean,
        required: true
    }

}, {
    timestamps: true
});


const Token = mongoose.model('Tokens', tokenSchema);

module.exports = Token;
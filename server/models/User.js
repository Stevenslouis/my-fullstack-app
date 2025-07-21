const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true
    }, 
    password :{
        type: String,
        required: true
    }, 
    resetToken: { type: String}, 
    resetExpires: {type: Date, expireAfterSeconds: 3600}

}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)
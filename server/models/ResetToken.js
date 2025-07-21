const mongoose = require('mongoose');
const { Schema } = mongoose;

const resetTokenSchema = new Schema({
  // Reference to the user
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  token: {
    type: String,
    required: true,
    unique: true 
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 
  }
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
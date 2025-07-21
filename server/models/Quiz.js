const mongoose = require('mongoose');



const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  correct: {
    type: Boolean,
    required: true
  }
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [optionSchema], 
    required: true,
    validate: {
      validator: function(options) {
        return options.length >= 2; 
      },
      message: 'Each question must have at least 2 options'
    }
  },
  answers: {
    type: [String],
    required: true,
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  questions: {
    type: [questionSchema],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
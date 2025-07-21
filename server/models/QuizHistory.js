
const mongoose = require('mongoose')

const { questionSchema } = require('./Quiz.js')




const userAnswer = new mongoose.Schema({
  questions: {
    type: [[String, String]],
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
const historySchema = new mongoose.Schema({

    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quizInfo: {
        type: [userAnswer],
        required: true
    },
    quizName:{
         type: String,
        required: true       
    },
    score:{
         type: Number,
        required: true  
    },
    createdAt: {
    type: Date,
    default: Date.now,
  }


}, { timestamps: true })

module.exports = mongoose.model('QuizHistory', historySchema);
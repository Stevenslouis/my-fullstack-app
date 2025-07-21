const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware.js');
const {getQuizzes, addQuiz, deleteQuiz, updateQuiz, uploadQuiz, getQuizHistory} = require('../controllers/quiz-controller.js');



router.get('/get', authMiddleware, getQuizzes);
router.post('/add', authMiddleware, addQuiz);
router.delete('/delete', authMiddleware, deleteQuiz);
router.patch('/update', authMiddleware, updateQuiz);
router.post('/upload', authMiddleware, uploadQuiz);
router.post('/history', authMiddleware, getQuizHistory);

module.exports = router

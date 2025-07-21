const Users = require('../models/User')
const Quiz = require('../models/Quiz')
const QuizHistory = require('../models/QuizHistory')

const updateQuiz = async (req, res) => {
    try {
        const { id, title, questions } = req.body
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Quiz ID is required"
            });
        }
        const updateResult = await Quiz.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                title: title,
                questions: questions
            }
        },
            { returnDocument: "after" }
        );

        if (updateResult) {
            return res.status(200).json({
                success: true,
                message: "quiz updated successfully"
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Could not update quiz"
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "could not update quiz"
        })
    }
}

const deleteQuiz = async (req, res) => {
    try {

        const quizId = req.body._id
        if (!quizId) {
            return res.status(400).json({
                success: false,
                message: "Quiz ID is required"
            });
        }
        const deleteResult = await Quiz.deleteOne({
            _id: quizId
        });

        deleteHistory = await QuizHistory.deleteMany({ quizId: quizId })

        if (deleteResult.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: "Quiz successfully deleted"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Quiz not found (no matching ID)"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "could not delete quiz"
        })
    }
}

const getQuizzes = async (req, res) => {

    try {
        const userId = req.userInfo.userId
        const userQuizzes = await Quiz.find({ createdBy: userId }).populate('createdBy')

        if (userQuizzes) {
            res.status(201).json({
                success: true,
                data: userQuizzes
            })
        } else {
            res.status(400).json({
                success: false,
                message: "no quizzes found"
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "could not retrieve quizzes"
        })
    }
}

const getQuizHistory = async (req, res) => {

    try {
        const id = req.body._id
        const quizHistory = await QuizHistory.find({ quizId: id }).sort({ createdAt: -1 })

        if (quizHistory) {
            return res.status(201).json({
                success: true,
                data: quizHistory
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "no history found"
            })
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "could not retrieve quizzes"
        })
    }
}

const addQuiz = async (req, res) => {

    try {
        const userId = req.userInfo.userId
        const { title, questions } = req.body

        const quizExists = await Quiz.findOne({ createdBy: userId, title: title });

        if (quizExists) {
            return res.status(400).json({
                success: false,
                message: "A quiz with this name already exists"
            })
        }
        const newlyCreatedQuiz = new Quiz({
            title,
            questions,
            createdBy: userId,
        })

        await newlyCreatedQuiz.save()

        if (newlyCreatedQuiz) {
            return res.status(200).json({
                success: true,
                message: "Quiz saved successfully"
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "could not save quiz, try again later"
        })
    }
}


const uploadQuiz = async (req, res) => {

    try {
        const { quizId, quizName, quizInfo, score } = req.body
        const quizExists = await Quiz.findOne({ _id: quizId });

        if (!quizExists) {
            return res.status(400).json({
                success: false,
                message: "Could not find Quiz"
            })
        }
        const newlyCreatedQuizHistory = new QuizHistory({
            quizId,
            quizInfo,
            quizName,
            score
        })

        await newlyCreatedQuizHistory.save()

        if (newlyCreatedQuizHistory) {
            return res.status(200).json({
                success: true,
                message: "Quiz saved successfully"
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "could not save quiz history, try again later"
        })
    }
}

module.exports = { getQuizzes, addQuiz, deleteQuiz, updateQuiz, uploadQuiz, getQuizHistory }
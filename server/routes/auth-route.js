const express = require('express')

const router = express.Router()

const {registerUser, loginUser, checkLogin, logOutUser, sendResetLink, checkResetToken, updatePassword} = require('../controllers/auth-controller')

const authMiddleware = require('../middleware/auth-middleware')

router.post("/register",registerUser)
router.post("/login", loginUser)
router.post("/logout", logOutUser)
router.get("/check", authMiddleware, checkLogin)
router.post("/send-reset-link", sendResetLink)
router.put("/reset-password", updatePassword)
router.post("/check-password-reset-token", checkResetToken)



module.exports = router
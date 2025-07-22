const jwt = require('jsonwebtoken')
const User = require('../models/User');

// Generate a 64-byte (512-bit) random string
const authMiddleware = async (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. Please Login"
        })
    }

    //decode this token 
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // puts decrypted user id in req.userinfo for future use. 
        req.userInfo = decodedTokenInfo

        const user = await User.findById(req.userInfo.userId);

        if (!user) {
            res.clearCookie('access_token', {
                domain: '.stevens-quiz-app.com',
                httpOnly: true,
                secure: true, // true in prod, false in dev
                sameSite: 'lax',
            });
            return res.status(401).json({
                success: false,
                message: "Unable to verify user. Could not complete request.",
            });
        }

        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "something went wrong with authorization, try again"
        })
    }
}

module.exports = authMiddleware
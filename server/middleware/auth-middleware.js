const jwt = require('jsonwebtoken')
const User = require('../models/User');


const authMiddleware = async (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. Please Login"
        })
    }

    try {
        // do a check to see if user still exists during the session, incase account has been deleted
            //decode this token 
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

        //also log them out if they have a change password operation in progress
        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "something went wrong with authorization, try again"
        })
    }
}

module.exports = authMiddleware
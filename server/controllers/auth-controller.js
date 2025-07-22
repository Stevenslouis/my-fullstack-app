//register endpoint 
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ResetToken = require('../models/ResetToken');
const crypto = require('crypto');
const { sendResetEmail } = require('../helpers/link-sender');



const registerUser = async (req, res) => {

    try {

        // get user info from body

        const { email, emailCheck, password } = req.body

        // check if emails are different  

        if (email !== emailCheck) {
            res.status(500).json({
                success: false,
                message: "emails must match"
            })
        }
        //check if user already exists. 

        const checkExistinguser = await User.findOne({ email: email })
        if (checkExistinguser) {
            return res.status(400).json({
                success: false,
                message: " A user already exists with same email"
            })
        }

        //hash user pwd

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user and save

        const newlyCreatedUser = new User({
            email,
            password: hashedPassword
        })

        await newlyCreatedUser.save()


        //check if save was successful
        if (newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: "user registered successfully"
            })
        } else {
            res.status(201).json({
                success: true,
                message: "user registered successfully"
            })
        }

    } catch (err) {
        // throw error if could not register
        res.status(500).json({
            success: false,
            message: "something went wrong with registration, try again later"
        })
    }
}

const updatePassword = async (req, res) => {
    try {
        // get the token and new password from body

        const token = req.body._token
        const password = req.body._password

        // encrypt the password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //look for the resettoken doc that has the token. 

        const tokenObject = await ResetToken.findOne({ token: token })

        // extract userid  from the doc, and update password in db with encrypted password
        const userId = tokenObject.userId

        const user = await User.findOneAndUpdate({ _id: userId }, { $set: { password: hashedPassword } },       // set only the "name" field
            { new: true })

        await ResetToken.findByIdAndDelete(tokenObject._id)

        if (user) {
            return res.status(200).json({
                success: true,
                message: "Password updated successfully"
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Unable to update password, try again later"
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Unable to update password, try again later"
        })
    }
}

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "invalid username or password"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "invalid username or password"
            })
        }
        // create user token
        const accessToken = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })

        res.cookie('access_token', accessToken, {
            domain: '.stevens-quiz-app.com',
            httpOnly: true,
            secure: true, // Set to true in production (HTTPS)
            sameSite: 'lax',
            maxAge: 3600000
        });
        res.status(200).json({
            success: true,
            message: "logged in successfully",
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "something went wrong, try again later"
        })
    }

}


const checkLogin = async (req, res) => {
    try {
        if (req.userInfo.userId) {

            const user = await User.findById(req.userInfo.userId);

            return res.status(200).json({
                success: true,
                message: "user currently signed in",
                data: user.email
            })
        }
        res.status(500).json({
            success: false,
            message: "something went wrong with check login, try again later"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "something went wrong with check login, try again later"
        })
    }
}

const checkResetToken = async (req, res) => {

    try {
        const { token } = req.body
        console.log("token", req.body);

        const isValidToken = await ResetToken.findOne({ token: token })

        if (isValidToken) {
            return res.status(200).json({
                success: true,
                message: "token is valid"
            })
        }
        return res.status(500).json({
            success: false,
            message: "could not validate token"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "could not validate token"
        })
    }
}

const logOutUser = async (req, res) => {
    res.clearCookie('access_token', {
        domain: '.stevens-quiz-app.com',
        httpOnly: true,
        secure: true, // true in prod, false in dev
        sameSite: 'lax',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}

const sendResetLink = async (req, res) => {

    try {
        const email = req.body.email
        console.log(email);

        const user = await User.findOne({ email: email })
        //check if user exists 
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Could Not Find User With This Email"
            })
        }
        //check if they already have an active reset token, and delete it
        const activeToken = await ResetToken.findOne({ userId: user._id })
        console.log(activeToken)
        if (activeToken) {
            await ResetToken.deleteOne({ _id: activeToken._id })
        }

        //generate new reset password token
        const token = crypto.randomBytes(32).toString('hex');

        const resetToken = new ResetToken({
            userId: user._id,
            token
        });
        await resetToken.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        sentStatus = await sendResetEmail(user.email, resetLink)

        res.status(200).json({
            success: true,
            message: "Link Sent Successfully, "
        })
    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}





module.exports = {
    loginUser,
    registerUser,
    sendResetLink,
    checkLogin,
    logOutUser,
    checkResetToken,
    updatePassword
}
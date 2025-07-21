const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendResetEmail = async (email, resetLink) => {


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  try{
    return await transporter.sendMail(mailOptions)
  }catch(err){
    throw new Error("Failed to send reset email. Make sure email is valid.");
  }
};

module.exports = { sendResetEmail };


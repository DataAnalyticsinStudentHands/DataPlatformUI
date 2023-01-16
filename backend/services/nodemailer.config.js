const nodemailer = require("nodemailer");
require("dotenv").config();


// const user = process.env.SENDEREMAIL;
// const pass = process.env.SENDERPASSWORD;
//the email used has to have 2-step 
const user = "data.platform1234@gmail.com"
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: "data.platform1234@gmail.com",
    pass: "qnisbiwpcmhgdfew",
    // user: user,
    // pass: pass,
  },
});
//the link used in this email will have to be modified and later replaced with the production link
//sends cnfirmation email
module.exports.sendConfirmationEmail = (name, email, code) => {
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for registering. Please confirm your email with the confirmation code provided below.</p>
          <p>Confirmation code: ${code}</p>
          <a href=http://127.0.0.1:5173/verify> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };
  //sends reset password email
  module.exports.sendResetPasswordEmail = (email, code) => {
    transport.sendMail({
      from: user,
      to: email,
      subject: "Reset Password",
      html: `<h1>Password Reset</h1>
          <p>Please use the link and confirmation code provided below to reset your password.</p>
          <p>If you have not requested a password reset please log into your account and update your password as soon as possible!</p>
          <p>Confirmation code: ${code}</p>
          <a href=http://127.0.0.1:5173/resetPasswordForm> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };
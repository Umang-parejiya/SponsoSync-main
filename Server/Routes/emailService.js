const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sponsosync@gmail.com',
      pass: process.env.NODEMAILER_KEY,
    },
  });
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "yashrajsharma1910@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports = sendEmail;
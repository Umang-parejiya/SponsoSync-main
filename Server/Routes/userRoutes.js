const express = require('express');
const router = express.Router();
const User = require('../Model/user');
const { generateToken, jwtAuthMiddleware } = require('../middleware/jwt');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sponsosync@gmail.com',
      pass: process.env.NODEMAILER_KEY,
    },
  });

// Generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpStore = {};

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const savedUser = await newUser.save()
        
        const payload = {
            id: savedUser.id,
            username: savedUser.username
        }

        const token = generateToken(payload);
        console.log("token :", token);
        res.status(200).json({ savedUser: savedUser, token: token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Update user credits
router.patch('/:userId/credits', async (req, res) => {
    try {
        const { userId } = req.params;
        const { credits } = req.body;

        if (typeof credits !== 'number') {
            return res.status(400).json({ error: 'Invalid credits value' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(user.password === password)) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        // generate token
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);
        res.status(200).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by userId
        const user = await User.findOne({ _id: userId }); // Use _id if userId is the MongoDB ObjectId

        // If user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user data
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/me', jwtAuthMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();
        otpStore[email] = otp;

        const mailOptions = {
            from: 'yashrajsharma1910@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: ` Your OTP for password reset is: ${otp}.
            otp is valid for only 5 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send OTP' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (otpStore[email] === otp) {
            delete otpStore[email];
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
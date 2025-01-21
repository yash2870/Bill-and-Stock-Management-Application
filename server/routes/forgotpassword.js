const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 

const router = express.Router();

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Respond with a generic message to avoid exposing user existence
            return res.status(400).json({ message: 'Email not registered.' });
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');

        // Hash the token before storing it
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Save the hashed token and its expiration time in the user's record
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.EMAIL_PASSWORD, // Your email password or app password
            },
        });

        // Create the password reset link
        const resetLink = `http://localhost:5173/reset-password/${token}`; // Adjust for your frontend URL
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_blank">${resetLink}</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'If your email exists, you will receive a password reset link.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});


module.exports = router;

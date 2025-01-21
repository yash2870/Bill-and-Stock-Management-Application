const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ensure the User model path is correct

const router = express.Router();

// Reset Password Route

// router.post('/reset-password/:token', async (req, res) => {
//     const { token } = req.params; // Get the token from the URL
//     const { password } = req.body; // Get the password from the request body

//     try {
//         console.log("Token Received:", token);
//         console.log("Password Received:", password);

//         // Hash the token to match the stored hashed token
//         const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
//         console.log("Hashed Token:", hashedToken);

//         // Find the user with the valid token and ensure it is not expired
//         const user = await User.findOne({
//             resetPasswordToken: hashedToken,
//             resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
//         });

//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired reset token' });
//         }

//         // Validate the new password (optional regex for strong passwords)
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({
//                 message:
//                     'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.',
//             });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Update the user's password
//         user.password = hashedPassword;

//         // Invalidate the old token and expiration after use
//         user.resetPasswordToken = undefined; // Remove the reset token
//         user.resetPasswordExpires = undefined; // Remove the expiration time

//         // **Generate a new token for future resets** after this one
//         // If the password reset is successful, invalidate previous reset token for better security
//         user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); // New token
//         user.resetPasswordExpires = Date.now() + 3600000; // Set the new expiration time (1 hour from now)

//         await user.save();

//         res.status(200).json({ message: 'Password has been reset successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred. Please try again later.' });
//     }
// });
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params; // Get the token from the URL
    const { password } = req.body; // Get the password from the request body

    try {
        // Hash the token to match the stored hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user with the valid token and ensure it is not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.Please try again later!' });
        }

        // Validate the new password (optional regex for strong passwords)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.',
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        user.password = hashedPassword;

        // Invalidate the old token and expiration after use
        user.resetPasswordToken = undefined; // Remove the old reset token
        user.resetPasswordExpires = undefined; // Remove the expiration time

        // **Generate a new token for future resets** after this one
        user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); // New token
        user.resetPasswordExpires = Date.now() + 3600000; // Set the new expiration time (1 hour from now)

        // Save the user with the updated reset token and password
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

module.exports = router;

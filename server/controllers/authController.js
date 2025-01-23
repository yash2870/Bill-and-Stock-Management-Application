const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// @desc    Login user and send token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' } // Token expiration time
        );

        // Send token as a cookie (HTTP-only for security)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send user data (excluding password) and token in response
        const { password: _, ...userData } = user._doc; // Exclude password from the response
        res.status(200).json({
            message: 'Login successful!',
            user: userData,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { loginUser };

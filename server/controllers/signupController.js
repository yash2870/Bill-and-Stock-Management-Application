const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load environment variables
require('dotenv').config();

const signup = async (req, res) => {
    const { businessName, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            businessName,
            email,
            password: hashedPassword,
        });

        // Save the user in the database
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Return response with the token
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: savedUser._id,
                businessName: savedUser.businessName,
                email: savedUser.email,
            },
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { signup };

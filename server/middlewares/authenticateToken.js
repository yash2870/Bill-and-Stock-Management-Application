const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model for authentication

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Token sent in the Authorization header as "Bearer token"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
        req.userId = decoded.id; // Store the user ID from the token in the request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyToken };

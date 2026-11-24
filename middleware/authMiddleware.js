
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
    try {

        let token;

        // Check if the Authorization header contains a Bearer token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, no token provided'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        req.user = await User.findById(decoded.id);

        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, user not found'
            });
        }

        // Allow request to continue
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Not authorized, token is invalid or expired'
        });
    }
};

module.exports = protect;


const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Generate JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

// Register a new user
const registerUser = async (req, res) => {
    try {

        // Get user details from the request body
        const { name, email, password } = req.body;

        // Check that all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email and password'
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Create the user
        const user = await User.create({
            name,
            email,
            password
        });

        // Send successful response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });

    }
};


const loginUser = async (req, res) => {
    try {

        // Get email and password from request body
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }

        // Find user and include password hash
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Compare entered password with stored hash
        const isPasswordCorrect = await user.matchPassword(password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        const token = generateToken(user._id)
        // Login successful
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });

    }
};


// Export the controller
module.exports = { registerUser, loginUser };
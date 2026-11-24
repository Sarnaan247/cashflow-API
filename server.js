
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Temporary protected route for testing authentication
const protect = require('./middleware/authMiddleware');

app.get('/api/protected', protect, (req, res) => {
    res.status(200).json({
        message: 'You have accessed a protected route successfully',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to CashFlow API'
    });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`CashFlow API running on port ${PORT}`);
});

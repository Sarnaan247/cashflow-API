
const Transaction = require('../models/Transaction');

// Create a new transaction

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        // Get transaction details from the request body
        const { title, amount, type, category, date } = req.body;

        // Check required fields
        if (
            !title ||
            amount === undefined ||
            amount === null ||
            !type ||
            !category
        ) {
            return res.status(400).json({
                message: 'Please provide title, amount, type and category'
            });
        }

        // Validate transaction amount
        if (Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
            return res.status(400).json({
                message: 'Amount must be a valid number greater than zero'
            });
        }

        // Validate transaction type
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({
                message: 'Type must be either income or expense'
            });
        }

        // Validate transaction category
        if (!['food', 'transport', 'data', 'salary', 'others'].includes(category)) {
            return res.status(400).json({
                message: 'Invalid transaction category'
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            title,
            amount: Number(amount),
            type,
            category,
            date,
            owner: req.user._id
        });

        // Return successful response
        return res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });

    } catch (error) {

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Invalid transaction data',
                error: error.message
            });
        }

        // Handle other errors
        return res.status(500).json({
            message: 'Failed to create transaction',
            error: error.message
        });
    }
};

// Get all transactions belonging to the logged-in user

const getTransactions = async (req, res) => {
    try {

        // Get filter and sorting values from the URL
        const { category, type, sort, month } = req.query;

        // Always restrict results to the logged-in user
        const filter = {
            owner: req.user._id
        };

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by transaction type
        if (type) {
            filter.type = type;
        }

        // Filter by month
        if (month) {

            // Check that month follows YYYY-MM format
            if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
                return res.status(400).json({
                    message: 'Invalid month format. Use YYYY-MM'
                });
            }

            // Get the first day of the selected month
            const startDate = new Date(`${month}-01T00:00:00.000Z`);

            // Get the first day of the following month
            const endDate = new Date(startDate);
            endDate.setUTCMonth(endDate.getUTCMonth() + 1);

            filter.date = {
                $gte: startDate,
                $lt: endDate
            };
        }

        // Determine sorting order
        const sortOrder = sort === 'oldest' ? 1 : -1;

        // Retrieve transactions
        const transactions = await Transaction.find(filter)
            .sort({ date: sortOrder });

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            count: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve transactions',
            error: error.message
        });
    }
};



// Get a single transaction belonging to the logged-in user
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction retrieved successfully',
            transaction
        });

    } catch (error) {
        res.status(400).json({
            message: 'Invalid transaction ID',
            error: error.message
        });
    }
};


// Update an existing transaction
const updateTransaction = async (req, res) => {
    try {

        const { title, amount, type, category, date } = req.body;

        // Find and update only a transaction belonging to the logged-in user
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user._id
            },
            {
                title,
                amount,
                type,
                category,
                date
            },
            { returnDocument: 'after', runValidators: true }
        );

        // Check if transaction exists
        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction
        });

    } catch (error) {

        res.status(500).json({
            message: 'Failed to update transaction',
            error: error.message
        });

    }
};


const deleteTransaction = async (req, res) => {
    try {

        // Find and delete only a transaction belonging to the logged-in user
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction deleted successfully',
            transaction
        });

    } catch (error) {
        res.status(400).json({
            message: 'Failed to delete transaction',
            error: error.message
        });
    }
};

// Get transaction summary
const getTransactionSummary = async (req, res) => {
    try {

        const summary = await Transaction.aggregate([

            // Get transactions belonging to the logged-in user
            {
                $match: {
                    owner: req.user._id
                }
            },

            // Group transactions by type and calculate totals
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }

        ]);

        // Get total income and expenses
        const totalIncome = summary.find(
            item => item._id === 'income'
        )?.total || 0;

        const totalExpenses = summary.find(
            item => item._id === 'expense'
        )?.total || 0;

        // Calculate balance
        const balance = totalIncome - totalExpenses;

        res.status(200).json({
            message: 'Transaction summary retrieved successfully',
            totalIncome,
            totalExpenses,
            balance
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve transaction summary',
            error: error.message
        });
    }
};


const getMonthlyTransactionSummary = async (req, res) => {
    try {

        // Get the requested month from the URL
        const { month } = req.query;

        // Check that a month was provided
        if (!month) {
            return res.status(400).json({
                message: 'Please provide a month in YYYY-MM format'
            });
        }

        // Validate month format
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
            return res.status(400).json({
                message: 'Invalid month format. Use YYYY-MM'
            });
        }

        // Calculate the beginning of the selected month
        const startDate = new Date(`${month}-01T00:00:00.000Z`);

        // Calculate the beginning of the next month
        const endDate = new Date(startDate);
        endDate.setUTCMonth(endDate.getUTCMonth() + 1);

        // Calculate monthly totals using MongoDB aggregation
        const summary = await Transaction.aggregate([
            {
                $match: {
                    owner: req.user._id,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,

                    totalIncome: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'income'] },
                                '$amount',
                                0
                            ]
                        }
                    },

                    totalExpenses: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'expense'] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalIncome: 1,
                    totalExpenses: 1,
                    balance: {
                        $subtract: [
                            '$totalIncome',
                            '$totalExpenses'
                        ]
                    }
                }
            }
        ]);

        // Handle months with no transactions
        const result = summary[0] || {
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0
        };

        res.status(200).json({
            message: 'Monthly summary retrieved successfully',
            month,
            ...result
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve monthly summary',
            error: error.message
        });
    }
};

// Export controller functions
module.exports = {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary,
    getMonthlyTransactionSummary
};

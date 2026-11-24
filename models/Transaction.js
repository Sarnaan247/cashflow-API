
const mongoose = require('mongoose');

// Define the Transaction Schema
const transactionSchema = new mongoose.Schema({

    // Transaction title
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Transaction amount
    amount: {
        type: Number,
        required: true,
        min: 0
    },

    // Transaction type
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },

    // Transaction category
    category: {
        type: String,
        required: true,
        enum: ['food', 'transport', 'data', 'salary', 'others']
    },

    // Transaction date
    date: {
        type: Date,
        default: Date.now
    },

    // User who owns the transaction
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

// Create Transaction Model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

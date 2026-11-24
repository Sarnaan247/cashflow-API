
const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');

const {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary,
    getMonthlyTransactionSummary
} = require('../controllers/transactionController');

// Protect all transaction routes
router.use(protect);

// Get all transactions and create a transaction
router.route('/')
    .get(getTransactions)
    .post(createTransaction);
// Get transaction summary
router.get('/summary', getTransactionSummary);
// Get monthly transaction summary
router.get('/summary/monthly', getMonthlyTransactionSummary);
// Get and update a single transaction
router.route('/:id')
    .get(getTransaction)
    .put(updateTransaction)
    .delete(deleteTransaction);
// Get monthly transaction summary
module.exports = router;

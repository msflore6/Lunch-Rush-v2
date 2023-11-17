const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/transactions/:locationID', transactionController.getTransactionsByLocation);
router.get('/transactions/lineItems/:transactionID', transactionController.getTransactionLineItemsByTransaction);

module.exports = router;
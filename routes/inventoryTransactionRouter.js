const express = require('express');
const router = express.Router();
const inventoryTransactionController = require('../controllers/inventoryTransactionController');

router.get('/inventoryTransactions/:locationID', inventoryTransactionController.getInventoryTransactionsByLocation);
router.get('/inventoryTransactions/lineItems/:inventoryTransactionID', inventoryTransactionController.getInventoryTransactionLineItemsByInventoryLog);

module.exports = router;
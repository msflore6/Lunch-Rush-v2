const express = require('express');
const router = express.Router();
const inventoryTransactionController = require('../controllers/inventoryTransactionController');

router.get('/inventoryTransactions/:locationID', inventoryTransactionController.getInventoryTransactionsByLocation);
router.get('/inventoryTransactions/:locationID/:startDate/:endDate/', inventoryTransactionController.getInventoryTransactionsByLocationByDateRange);
router.get('/inventoryTransactions/lineItems/:inventoryTransactionID', inventoryTransactionController.getInventoryTransactionLineItemsByInventoryLog);
router.get('/inventoryTransactions/latest/:locationID', inventoryTransactionController.getLatestInventoryTransactionByLocation);

router.post('/inventoryTransactions/', inventoryTransactionController.postInventoryTransaction);
router.post('/inventoryTransactions/lineItems', inventoryTransactionController.postInventoryTransactionLineItems);

module.exports = router;
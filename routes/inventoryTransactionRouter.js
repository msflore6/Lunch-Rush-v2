const express = require('express');
const router = express.Router();
const inventoryTransactionController = require('../controllers/inventoryTransactionController');

router.get('/inventoryTransactions/:locationID', inventoryTransactionController.getInventoryTransactionsByLocation);
router.get('/inventoryTransactions/lineItems/:inventoryTransactionID', inventoryTransactionController.getInventoryTransactionLineItemsByInventoryLog);
router.get('/inventoryTransactions/latestID/:locationID', inventoryTransactionController.getLatestInventoryTransactionIDByLocation);

router.post('/inventoryTransactions/', inventoryTransactionController.postInventoryTransaction);
router.post('/inventoryTransactions/lineItems', inventoryTransactionController.postInventoryTransactionLineItems);

module.exports = router;
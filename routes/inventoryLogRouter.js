const express = require('express');
const router = express.Router();
const inventoryLogController = require('../controllers/inventoryLogController');

router.get('/inventoryLogs/:locationID', inventoryLogController.getInventoryLogsByLocation);
router.get('/inventoryLogs/lineItems/:inventoryLogID', inventoryLogController.getInventoryLogLineItemsByInventoryLog);
router.get('/inventoryLogs/latestID/:locationID', inventoryLogController.getLatestInventoryLogIDByLocation);

router.post('/inventoryLogs/', inventoryLogController.postInventoryLog);
router.post('/inventoryLogs/lineItems', inventoryLogController.postInventoryLogLineItems);

module.exports = router;
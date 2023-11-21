const express = require('express');
const router = express.Router();
const inventoryLogController = require('../controllers/inventoryLogController');

router.get('/inventoryLogs/:locationID', inventoryLogController.getInventoryLogsByLocation);
router.get('/inventoryLogs/:locationID/:startDate/:endDate/', inventoryLogController.getInventoryLogsByLocationAndDateRange);
router.get('/inventoryLogs/lineItems/:inventoryLogID', inventoryLogController.getInventoryLogLineItemsByInventoryLog);
router.get('/inventoryLogs/latest/:locationID', inventoryLogController.getLatestInventoryLogByLocation);

router.post('/inventoryLogs/', inventoryLogController.postInventoryLog);
router.post('/inventoryLogs/lineItems', inventoryLogController.postInventoryLogLineItems);

module.exports = router;
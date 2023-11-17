const express = require('express');
const router = express.Router();
const inventoryLogController = require('../controllers/inventoryLogController');

router.get('/inventoryLogs/:locationID', inventoryLogController.getInventoryLogsByLocation);
router.get('/inventoryLogs/lineItems/:inventoryLogID', inventoryLogController.getInventoryLogLineItemsByInventoryLog);

module.exports = router;
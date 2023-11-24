const express = require('express');
const router = express.Router();
const inventoryLogController = require('../controllers/inventoryLogController');

// get inventory logs
router.get('/inventoryLogs/:locationID', inventoryLogController.getInventoryLogsByLocation);
router.get('/inventoryLogs/:locationID/:startDate/:endDate', inventoryLogController.getInventoryLogsByLocationAndDateRange);
router.get('/inventoryLogs/lineItems/:inventoryLogID', inventoryLogController.getInventoryLogLineItemsByInventoryLog);
router.get('/inventoryLogs/latest/:locationID', inventoryLogController.getLatestInventoryLogByLocation);

// get inventory discrepancies
router.get('/inventoryDiscrepancies/:locationID', inventoryLogController.getInventoryDiscrepanciesByLocation);
router.get('/inventoryDiscrepancies/:locationID/:startDate/:endDate', inventoryLogController.getInventoryDiscrepanciesByLocationAndDateRange);
router.get('/inventoryDiscrepancies/lineItems/:inventoryLogID', inventoryLogController.getInventoryDiscrepancyLineItemsByInventoryDiscrepancy);

//post inventory logs
router.post('/inventoryLogs', inventoryLogController.postInventoryLog);
router.post('/inventoryLogs/lineItems', inventoryLogController.postInventoryLogLineItems);

// post inventory discrepancies
router.post('/inventoryDiscrepancies', inventoryLogController.postInventoryDiscrepancy);
router.post('/inventoryDiscrepancies/lineItems', inventoryLogController.postInventoryDiscrepancyLineItems);

module.exports = router;
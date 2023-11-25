const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// get deliveries
router.get('/orders/:locationID', deliveryController.getOrderDeliveriesByLocation);
router.get('/inventoryTransactions/:locationID', deliveryController.getInventoryTransactionDeliveriesByLocation);
router.get('/orders/:locationID/:startDate/:endDate', deliveryController.getOrderDeliveriesByLocationByDateRange);
router.get('/inventoryTransactions/:locationID/:startDate/:endDate', deliveryController.getInventoryTransactionDeliveriesByLocationByDateRange);

// for reporting & analytics
router.get('/ordersReporting/:locationID', deliveryController.getOrderDeliveriesByLocationForReporting);
router.get('/inventoryTransactionsReporting/:locationID', deliveryController.getInventoryTransactionDeliveriesByLocationForReporting);
router.get('/ordersReporting/:locationID/:startDate/:endDate', deliveryController.getOrderDeliveriesByLocationByDateRangeForReporting);
router.get('/inventoryTransactionsReporting/:locationID/:startDate/:endDate', deliveryController.getInventoryTransactionDeliveriesByLocationByDateRangeForReporting);

// get delivery line items
router.get('/deliveries/lineItems/:deliveryID', deliveryController.getDeliveryLineItemsByDelivery);
router.get('/deliveries/latest/:locationID', deliveryController.getLatestDeliveryByLocation);

// post deliveries
router.post('/deliveries/order', deliveryController.postOrderDelivery);
router.post('/deliveries/inventoryTransaction', deliveryController.postInventoryTransactionDelivery);
router.post('/deliveries/lineItems', deliveryController.postDeliveryLineItems);

module.exports = router;
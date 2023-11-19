const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/orders/:locationID', orderController.getOrdersByLocation);
router.get('/orders/lineItems/:orderID', orderController.getOrderLineItemsByOrder);
router.get('/orders/latestID/:locationID', orderController.getLatestOrderIDByLocation);

router.post('/orders', orderController.postOrder);
router.post('/orders/lineItems', orderController.postOrderLineItems);

module.exports = router;
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/orders/:locationID', orderController.getOrdersByLocation);
router.get('/orders/lineItems/:orderID', orderController.getOrderLineItemsByOrder);

module.exports = router;
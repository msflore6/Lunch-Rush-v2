const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController')

router.get('/menuItems/:menuItemID', menuItemController.getMenuItemByID);
router.get('/menuItems/ingredients/:menuItemID', menuItemController.getIngredientsByMenuItem);

module.exports = router;
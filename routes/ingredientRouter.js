const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

router.get('/ingredients', ingredientController.getAllIngredients);

module.exports = router;
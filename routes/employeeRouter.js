const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employees/:locationID', employeeController.getEmployeesByLocation);

module.exports = router;
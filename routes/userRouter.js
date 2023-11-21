const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/change-password', verifyToken, userController.changePassword);
router.post('/login', userController.loginUser);

router.get('/checkTokenExpiration', verifyToken, userController.checkTokenExpiration);
router.get('/logout', userController.logoutUser);
router.get('/userInfo', userController.getUserInfo);

module.exports = router;
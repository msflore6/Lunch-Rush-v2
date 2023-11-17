const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
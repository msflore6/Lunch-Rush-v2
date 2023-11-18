const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const authenticateJWT = (req, res, next) => {
  const token = req.cookies['authToken'];

  if (!token) {
    const redirectUrl = '/login.html?message=' + encodeURIComponent('You must be logged in to access this page.');
    return res.redirect(redirectUrl);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;

    if (req.originalUrl.includes('/login.html') || req.originalUrl.includes('/account-creation.html')) {
      return res.redirect('/index.html');
    }

    next();
  });
};

module.exports = authenticateJWT;
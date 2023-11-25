const jwt = require('jsonwebtoken');
require('dotenv').config();

// const secretKey = process.env.SECRET_KEY;
const secretKey = "ASUIFT402CapstoneLunchRushBuhlFloresFredericksenSparksWalsh";

const handleLoginRedirect = (res, message) => {
  const redirectUrl = `/login.html?message=${encodeURIComponent(message)}`;
  return res.redirect(redirectUrl);
};

const authenticateJWT = (req, res, next) => {
  const token = req.cookies['authToken'];

  if (!token) {
    return handleLoginRedirect(res, 'You must be logged in to access this page.');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        // Token is invalid, user never had a valid token
        return handleLoginRedirect(res, 'You must be logged in to access this page.');
      } else if (err.name === 'TokenExpiredError') {
        // Token has expired
        return handleLoginRedirect(res, 'Your session has expired, please log back in.');
      } else {
        // Other errors during token verification
        return handleLoginRedirect(res, 'You must be logged in to access this page.');
      }
    }

    req.user = user;

    if (req.originalUrl.includes('/login.html') || req.originalUrl.includes('/account-creation.html')) {
      return res.redirect('/index.html');
    }

    next();
  });
};

module.exports = authenticateJWT;
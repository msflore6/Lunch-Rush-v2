const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
require('dotenv').config();

function generateToken(user) {
  const expiresIn = '1h';
  return jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
}

function getLocationID(token) {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.locationID; 
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

module.exports = { generateToken, verifyToken, getLocationID };

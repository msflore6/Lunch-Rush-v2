const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = 'process.env.SECRET_KEY';

exports.registerUser = (req, res) => {
    const { firstName, lastName, username, password, confirm_password, employeeID, locationID } = req.body;
  
    if (password !== confirm_password) {
        const alertMessage = 'Passwords do not match';
        return res.status(400).send(createAlertHtml(alertMessage));
    }
  
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        const alertMessage = 'Internal Server Error';
        return res.status(500).send(createAlertHtml(alertMessage));
      }
  
      // Check if an employee with the provided details exists and has jobRole = 3
      const employeeID = parseInt(req.body.employeeID, 10)
      const locationID = parseInt(req.body.locationID, 10)
      const employeeQuery = 'SELECT * FROM Employees WHERE firstName = ? AND lastName = ? AND employeeID = ? AND locationID = ? AND jobRole = 3';
      db.query(employeeQuery, [firstName, lastName, employeeID, locationID], (err, employeeResults) => {
        if (err) {
            console.error('Error querying employee:', err);
            const alertMessage = 'Internal Server Error';
            return res.status(500).send(createAlertHtml(alertMessage));
        }
  
        if (employeeResults.length === 0) {
            const alertMessage = 'Unauthorized: Not a manager or invalid employee details';
            return res.status(403).send(createAlertHtml(alertMessage));
        }
  
        // Insert the user into the Users table
        console.log('Hash: ', hash);
        const insertUserQuery = 'INSERT INTO Users (firstName, lastName, username, passwordHash, employeeID, locationID) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertUserQuery, [firstName, lastName, username, hash, employeeID, locationID], (err) => {
            if (err) {
                console.error('Error inserting user:', err);
                const alertMessage = 'Internal Server Error';
                return res.status(500).send(createAlertHtml(alertMessage));
            }
            const successMessage = 'User registered successfully.';
            const redirectUrl = '/login.html?message=' + encodeURIComponent(successMessage);
            return res.redirect(redirectUrl);
        });
      });
    });
};

exports.loginUser = (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM Users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        console.log('Username: ', username);
        console.log('Query: ', query);
        if (err) {
        console.log('Database Results:', results);
        console.error('Error querying user:', err);
        return handleLoginFailure(res, 'Internal Server Error');
        }
  
        if (results.length === 0) {
            console.log('if (results.length === 0) { was triggered')
            console.log('Database Results:', results);
            return handleLoginFailure(res, 'Invalid username or password');
        }
  
      const user = results[0];
  
      // Compare the hashed password
      bcrypt.compare(password.trim(), user.passwordHash, (err, match) => {
        if (err) {
            console.log('Error comparing passwords.')
            console.error('Error comparing passwords:', err);
            return handleLoginFailure(res, 'Internal Server Error');
        }
  
        if (!match) {
            console.log('Password Hash did not match.')
            return handleLoginFailure(res, 'Invalid username or password');
        }
  
        const token = jwt.sign({ username: user.username, userId: user.id, locationID: user.locationID }, secretKey);
  
        // Check if the request is an API call or HTML form submission
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.json({ token });
        } else {
            console.log("Attempted to redirect user to index.html")
            res.json({ token, redirect: '/index.html' });
        }
      });
    });
};
  
function handleLoginFailure(res, message) {
    const alertMessage = `<script>alert('${message}'); window.location.href='/login.html';</script>`;
  
    // Check if the request is an API call or HTML form submission
    if (res.headersSent) {
      // This means the response has already been sent (probably an API call)
      console.error('Login failure:', message);
      return res.status(401).send(alertMessage);
    } else {
      // HTML form submission, redirect with an error message
      console.error('Login failure:', message);
      res.send(alertMessage);
    }
  }
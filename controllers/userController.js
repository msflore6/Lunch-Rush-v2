const db = require('../middleware/dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// const secretKey = process.env.SECRET_KEY;
const secretKey = "ASUIFT402CapstoneLunchRushBuhlFloresFredericksenSparksWalsh";

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

exports.changePassword = (req, res) => {
  const { currentPassword, confirmCurrentPassword, newPassword, confirmNewPassword, username } = req.body;

  if (currentPassword !== confirmCurrentPassword) {
    return sendError(res, 'Current password and confirmation do not match');
  }

  // Check if new password and confirmation match
  if (newPassword !== confirmNewPassword) {
    return sendError(res, 'New password and confirmation do not match');
  }

  if (currentPassword === newPassword) {
    return sendError(res, 'New password cannot be the same as your current password');
  }

  // Retrieve the user's current password hash from the database
  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying user:', err);
      return res.status(500).send(createAlertHtml('Internal Server Error'));
    }

    if (results.length === 0) {
      return res.status(404).send(createAlertHtml('User not found'));
    }

    const user = results[0];

    // Compare the hashed current password
    bcrypt.compare(newPassword.trim(), user.passwordHash, (err, match) => {
      if (err) {
        return sendError(res, 'Internal Server Error');
      }

      if (match) {
        return sendError(res, 'Your new password cannot be your current password');
      }
    });

    bcrypt.compare(currentPassword.trim(), user.passwordHash, (err, match) => {
      if (err) {
        return sendError(res, 'Internal Server Error');
      }

      if (!match) {
        return sendError(res, 'Current password is incorrect');
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          return sendError(res, 'Internal Server Error');
        }

        // Update the user's password in the database
        const updateQuery = 'UPDATE Users SET passwordHash = ? WHERE username = ?';
        db.query(updateQuery, [hash, username], (err) => {
          if (err) {
            return sendError(res, 'Internal Server Error');
          }

          res.clearCookie('authToken');

          const newToken = jwt.sign(
            { 
              username: user.username, 
              userId: user.id, 
              firstName: user.firstName, 
              lastName: user.lastName, 
              locationID: user.locationID 
            }, 
            secretKey
          );
    
          res.cookie('authToken', newToken, { httpOnly: true, maxAge: 30 * 60 * 1000 });

          const successMessage = 'Password changed successfully.';
          res.json({ message: successMessage });
        });
      });
    });
  });
};

exports.loginUser = (req, res) => {
  console.log('Login request recieved')  
  
  const { username, password } = req.body;
  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying user:', err);
      return handleLoginFailure(res, 'Internal Server Error');
    }
  
    if (results.length === 0) {
      return handleLoginFailure(res, 'Invalid username or password');
    }
  
    const user = results[0];
  
    // Compare the hashed password
    bcrypt.compare(password.trim(), user.passwordHash, (err, match) => {
      if (err) {
          console.error('Error comparing passwords:', err);
          return handleLoginFailure(res, 'Internal Server Error');
      }
  
      if (!match) {
          return handleLoginFailure(res, 'Invalid username or password');
      }
  
      const token = jwt.sign(
        { 
          username: user.username, 
          userId: user.id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          locationID: user.locationID 
        }, 
        secretKey
        );

        res.cookie('authToken', token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
  
        res.json({ token });
      });
    });
};

exports.checkTokenExpiration = (req, res) => {
  res.json({ expired: false });
};

exports.logoutUser = (req, res) => {
  res.clearCookie('authToken');
  const logoutMessage = 'User logged out successfully.';
  res.json({ message: logoutMessage });
};

exports.getUserInfo = (req, res) => {
  const token = req.cookies.authToken;

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const userInfo = {
      username: decodedToken.username,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      locationID: decodedToken.locationID,
    };
    res.json(userInfo);
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function handleLoginFailure(res, message) {
    const alertMessage = `<script>alert('${message}'); window.location.href='/login.html';</script>`;
  
    // Check if the request is an API call or HTML form submission
    if (res.headersSent) {
      console.error('Login failure:', message);
      return res.status(401).send(alertMessage);
    } else {
      console.error('Login failure:', message);
      res.send(alertMessage);
    }
  };

  function sendError(res, message) {
    res.status(400).json({ error: message });
  }
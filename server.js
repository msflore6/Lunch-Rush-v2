const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const path = require('path');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const userController = require('./controllers/userController');
const cors = require('cors');
require('dotenv').config();
const { verifyToken } = require('./middleware/jwtUtils');

//routers
const userRoutes = require('./routes/userRouter');
const protectedRoutes = require('./routes/protectedRoute');
const employeeRouter = require('./routes/employeeRouter');
const transactionRouter = require('./routes/transactionRouter');
const orderRouter = require('./routes/orderRouter');
const inventoryLogRouter = require('./routes/inventoryLogRouter');
const inventoryTransactionRouter = require('./routes/inventoryTransactionRouter');
const menuItemRouter = require('./routes/menuItemRouter');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

// Serve login.html or index.html based on authentication
app.get('/', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    // If no token is present, user is not logged in
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  } else {
    // If token is present, user is logged in
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.post('/registration', userController.registerUser);
app.post('/login', userController.loginUser);

app.get('/protected', authenticateJWT, (req, res) => {
  // If the middleware passes, the user is authenticated
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirect unauthenticated requests to /protected to the login page
app.use('/protected', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Serve static files (including HTML) from the 'public' directory
app.use(express.static('public'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api', protectedRoutes); // Protected routes
app.use('/api/employees', employeeRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/orders', orderRouter);
app.use('/api/inventoryLogs', inventoryLogRouter);
app.use('/api/inventoryTransactions', inventoryTransactionRouter);
app.use('/api/menuItems', menuItemRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

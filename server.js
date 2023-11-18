const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000;
const path = require('path');
const userController = require('./controllers/userController');
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())

// routers
const userRoutes = require('./routes/userRouter');
const employeeRouter = require('./routes/employeeRouter');
const transactionRouter = require('./routes/transactionRouter');
const orderRouter = require('./routes/orderRouter');
const inventoryLogRouter = require('./routes/inventoryLogRouter');
const inventoryTransactionRouter = require('./routes/inventoryTransactionRouter');
const menuItemRouter = require('./routes/menuItemRouter');

// direct traffic and protect assets from users who aren't logged in
app.use((req, res, next) => {
  const token = req.cookies.authToken;

  if (
    (token && req.url.includes('login.html')) ||
    (token && req.url.includes('account-creation.html'))
  ) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else if (
    (req.url === '/')
  ) {
    if (token) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
  }  else if (
    !req.url.includes('login.html') &&
    !req.url.includes('account-creation.html') &&
    !req.url.includes('.css') &&
    !req.url.includes('.png') &&
    !req.url.includes('login') &&
    !req.url.includes('registration')
  ) {
    verifyToken(req, res, next);
  } else {
    next();
  }
});

// User registration and login
app.post('/registration', userController.registerUser);
app.post('/login', userController.loginUser);

// Serve static files
app.use(express.static('public'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/orders', orderRouter);
app.use('/api/inventoryLogs', inventoryLogRouter);
app.use('/api/inventoryTransactions', inventoryTransactionRouter);
app.use('/api/menuItems', menuItemRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
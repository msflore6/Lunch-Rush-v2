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
const deliveryRouter = require('./routes/deliveryRouter');

// direct traffic and protect assets from users who aren't logged in
app.use((req, res, next) => {
  const token = req.cookies.authToken;
  const URL = req.url;

  if (URL === '/') {
    if (token) {
      res.redirect('/index.html');
    } else {
      res.redirect('/login.html');
    }
  } else if (
    (token && URL.includes('login.html')) ||
    (token && URL.includes('account-creation.html'))
  ) {
    res.redirect('/index.html'); }
  else if (
    !URL.includes('login.html') &&
    !URL.includes('account-creation.html') &&
    !URL.includes('.css') &&
    !URL.includes('.png') &&
    !URL.includes('.js') &&
    !URL.includes('login') &&
    !URL.includes('registration')
  ) {
    verifyToken(req, res, next);
  } else {
    next();
  }
});

// Serve static files
app.use(express.static('public'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// API routes
app.post('/registration', userController.registerUser);
app.post('/login', userController.loginUser);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/orders', orderRouter);
app.use('/api/inventoryLogs', inventoryLogRouter);
app.use('/api/inventoryTransactions', inventoryTransactionRouter);
app.use('/api/menuItems', menuItemRouter);
app.use('/api/deliveries', deliveryRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
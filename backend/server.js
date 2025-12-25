const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const config = require('./config/config');

// Import routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.server.env === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(path.join(__dirname, '../frontend/views')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/products.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/product-detail.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/about.html'));
});



app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/checkout.html'));
});

app.get('/order-success.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/order-success.html'));
});

// Admin routes
app.get('/admin/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/admin/login.html'));
});

app.get('/admin/dashboard.html', (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/admin/login.html');
  }
  res.sendFile(path.join(__dirname, '../frontend/views/admin/dashboard.html'));
});

app.get('/admin/invoice.html', (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/admin/login.html');
  }
  res.sendFile(path.join(__dirname, '../frontend/views/admin/invoice.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


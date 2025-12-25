const bcrypt = require('bcryptjs');
const pool = require('../models/db');
const config = require('../config/config');

// Initialize admin user if not exists
const initializeAdmin = async () => {
  try {
    const [users] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [config.admin.defaultUsername]);
    
    if (users.length === 0) {
      const passwordHash = await bcrypt.hash(config.admin.defaultPassword, 10);
      await pool.execute(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        [config.admin.defaultUsername, passwordHash]
      );
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const [users] = await pool.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session
    req.session.isAdmin = true;
    req.session.adminId = user.id;
    req.session.adminUsername = user.username;
    
    res.json({ 
      message: 'Login successful',
      username: user.username
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Admin logout
const adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    // Total orders
    const [orderCount] = await pool.execute('SELECT COUNT(*) as total FROM orders');
    
    // Total revenue
    const [revenue] = await pool.execute(
      'SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "completed"'
    );
    
    // Pending orders
    const [pendingOrders] = await pool.execute(
      'SELECT COUNT(*) as total FROM orders WHERE order_status = "pending"'
    );
    
    // Recent orders (last 5)
    const [recentOrders] = await pool.execute(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );
    
    res.json({
      totalOrders: orderCount[0].total,
      totalRevenue: revenue[0].total || 0,
      pendingOrders: pendingOrders[0].total,
      recentOrders: recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Initialize admin on module load
initializeAdmin();

module.exports = {
  adminLogin,
  adminLogout,
  getDashboardStats
};







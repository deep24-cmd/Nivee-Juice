const pool = require('../models/db');

// Generate unique order number
const generateOrderNumber = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, items, total_amount, razorpay_order_id, payment_method } = req.body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !customer_address || !items || !total_amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const order_number = generateOrderNumber();

      // Create order
      // We check if payment_method is COD to set initial payment_status if needed
      const initial_payment_status = (payment_method === 'cod') ? 'pending' : 'pending';

      const [orderResult] = await connection.execute(
        `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, customer_address, total_amount, razorpay_order_id, payment_method) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [order_number, customer_name, customer_email, customer_phone, customer_address, total_amount, razorpay_order_id || null, payment_method || 'razorpay']
      );

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price, item.subtotal]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        order_id: orderId,
        order_number: order_number,
        message: 'Order created successfully'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, 
       COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order details
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items with product details
    const [items] = await pool.execute(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    order.items = items;

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const updates = [];
    const values = [];

    if (order_status) {
      updates.push('order_status = ?');
      values.push(order_status);
    }

    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Update payment status after Razorpay verification
const updatePaymentStatus = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, payment_status } = req.body;

    if (!razorpay_order_id || !payment_status) {
      return res.status(400).json({ error: 'Order ID and payment status are required' });
    }

    const [result] = await pool.execute(
      `UPDATE orders SET payment_status = ?, razorpay_payment_id = ? WHERE razorpay_order_id = ?`,
      [payment_status, razorpay_payment_id || null, razorpay_order_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
};







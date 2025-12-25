const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config/config');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      return res.status(500).json({ error: 'Razorpay configuration is missing. Please check your .env file.' });
    }
    
    const { amount, currency = 'INR' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    
    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);
    
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: config.razorpay.keyId
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      return res.status(500).json({ error: 'Razorpay configuration is missing. Please check your .env file.' });
    }
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification data is required' });
    }
    
    // Create signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(text)
      .digest('hex');
    
    // Verify signature
    if (generated_signature === razorpay_signature) {
      res.json({ 
        verified: true, 
        message: 'Payment verified successfully',
        razorpay_order_id,
        razorpay_payment_id
      });
    } else {
      res.status(400).json({ 
        verified: false, 
        error: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment
};


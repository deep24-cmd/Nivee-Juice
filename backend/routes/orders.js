const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', orderController.createOrder);
router.post('/update-payment', orderController.updatePaymentStatus);

// Admin routes
router.get('/', isAdmin, orderController.getAllOrders);
router.get('/:id', isAdmin, orderController.getOrderById);
router.put('/:id/status', isAdmin, orderController.updateOrderStatus);

module.exports = router;







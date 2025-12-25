const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.post('/login', adminController.adminLogin);
router.get('/logout', adminController.adminLogout);
router.get('/dashboard', isAdmin, adminController.getDashboardStats);

module.exports = router;







const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', isAdmin, upload.single('image'), productController.addProduct);
router.put('/:id', isAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

module.exports = router;







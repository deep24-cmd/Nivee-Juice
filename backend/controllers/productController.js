const pool = require('../models/db');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY display_order ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Add product (admin only)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, benefits, long_description, usage_steps, stock_quantity, display_order } = req.body;
    let { image_url } = req.body;

    // If a file was uploaded, use it
    if (req.file) {
      image_url = `/images/${req.file.filename}`;
    }

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, image_url, benefits, long_description, usage_steps, stock_quantity, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description || null, price, image_url || null, benefits || null, long_description || null, usage_steps || null, stock_quantity || 0, display_order || 0]
    );

    res.status(201).json({ id: result.insertId, message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id: originalId } = req.params;
    const { id: newId, name, description, price, benefits, long_description, usage_steps, stock_quantity, display_order } = req.body;
    let { image_url } = req.body;

    // If a new file was uploaded, use it
    if (req.file) {
      image_url = `/images/${req.file.filename}`;
    }

    // Check if new ID already exists (if it's different from original)
    if (newId && newId != originalId) {
      const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [newId]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Product ID already exists' });
      }
    }

    const [result] = await pool.execute(
      'UPDATE products SET id = ?, name = ?, description = ?, price = ?, image_url = ?, benefits = ?, long_description = ?, usage_steps = ?, stock_quantity = ?, display_order = ? WHERE id = ?',
      [newId || originalId, name, description, price, image_url, benefits, long_description, usage_steps, stock_quantity, display_order || 0, originalId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};







const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

// Add product to authenticated user's cart
router.post('/add', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += qty;
    } else {
      user.cart.push({ product: productId, quantity: qty });
    }
    await user.save();
    const populated = await User.findById(userId).populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove a product from the authenticated user's cart or decrease quantity
router.post('/remove', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ error: 'Product not in cart' });

    if (quantity && parseInt(quantity, 10) > 0) {
      // decrease quantity
      user.cart[itemIndex].quantity -= parseInt(quantity, 10);
      if (user.cart[itemIndex].quantity <= 0) {
        user.cart.splice(itemIndex, 1);
      }
    } else {
      // remove item completely
      user.cart.splice(itemIndex, 1);
    }

    await user.save();
    const populated = await User.findById(userId).populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get authenticated user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Clear cart
router.post('/clear', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

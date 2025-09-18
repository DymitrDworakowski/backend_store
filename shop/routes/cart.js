const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Додати товар у кошик
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Видалити товар з кошика
router.post('/remove', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Отримати кошик користувача
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.product');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

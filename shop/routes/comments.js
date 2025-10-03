const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

// Додати коментар до товару (тільки для залогінених)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { product, text } = req.body;
    if (!product) return res.status(400).json({ error: 'Product id is required' });
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

    const productExists = await Product.findById(product);
    if (!productExists) return res.status(404).json({ error: 'Product not found' });

    const comment = new Comment({ product, user: userId, text });
    await comment.save();
    await comment.populate('user', 'username');
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Отримати всі коментарі для товару
router.get('/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId }).populate('user', 'username');
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

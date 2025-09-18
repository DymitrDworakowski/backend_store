const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Додати коментар до товару
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
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

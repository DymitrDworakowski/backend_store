const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Додати товар
router.post('/products', createProduct);

// Редагувати товар
router.put('/products/:id', updateProduct);

// Видалити товар
router.delete('/products/:id', deleteProduct);

module.exports = router;

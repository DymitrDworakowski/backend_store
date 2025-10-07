const express = require('express');
const router = express.Router();
const { getAllProducts } = require("../controllers/productController");

const { getProductById } = require("../controllers/productController");

router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;

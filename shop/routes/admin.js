
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../public/images'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// Додати товар з фото
router.post('/products', upload.single('image'), createProduct);

// Редагувати товар
router.put('/products/:id', updateProduct);

// Видалити товар
router.delete('/products/:id', deleteProduct);

module.exports = router;

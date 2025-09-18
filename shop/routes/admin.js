
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

function isAdmin(req, res, next) {
	if (req.user && req.user.isAdmin) {
		return next();
	}
	return res.status(403).json({ error: 'Access denied: admin only' });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../public/images'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// Додати товар з фото (тільки для адміна)
router.post('/products', authenticateToken, isAdmin, upload.single('image'), createProduct);

// Редагувати товар (тільки для адміна)
router.put('/products/:id', authenticateToken, isAdmin, updateProduct);

// Видалити товар (тільки для адміна)
router.delete('/products/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;

const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    let productData = req.body;
    if (req.file) {
      productData.image = '/images/' + req.file.filename;
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Товар видалено' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

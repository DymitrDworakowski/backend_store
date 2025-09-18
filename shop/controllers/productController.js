const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    const totalProducts = await Product.countDocuments();
    const allProducts = await Product.find()
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt)
      .exec();
    res.json({
      products: allProducts,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitInt),
      currentPage: pageInt,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let productData = req.body;
    if (req.file) {
      productData.image = "/images/" + req.file.filename;
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

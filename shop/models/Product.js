const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  createdAt: { type: Date, default: Date.now }, 
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  barcode: { type: String, unique: true, sparse: true }
});

module.exports = mongoose.model('Product', productSchema);
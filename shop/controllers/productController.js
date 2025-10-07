const Product = require("../models/Product");

const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      minPrice,
      maxPrice,
      sort = 'createdAt:desc'
    } = req.query;

    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Parse sort spec (e.g. 'price:asc,createdAt:desc' or '-createdAt')
    let sortSpec = {};
    if (sort) {
      const parts = sort.split(',');
      parts.forEach(p => {
        const [fieldRaw, dirRaw] = p.split(':');
        if (!fieldRaw) return;
        if (fieldRaw.startsWith('-')) {
          const clean = fieldRaw.substring(1);
            sortSpec[clean] = -1;
            return;
        }
        const dir = dirRaw ? dirRaw.toLowerCase() : 'asc';
        sortSpec[fieldRaw] = dir === 'desc' ? -1 : 1;
      });
    }
    if (Object.keys(sortSpec).length === 0) {
      sortSpec = { createdAt: -1 };
    }

    const [ totalProducts, products ] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort(sortSpec)
        .skip((pageInt - 1) * limitInt)
        .limit(limitInt)
        .exec()
    ]);

    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitInt),
      currentPage: pageInt,
      pageSize: limitInt,
      filterApplied: filter,
      sort: sortSpec
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

// Admin-focused listing: supports search, category, price range, sorting, stats
exports.getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category,
      minPrice,
      maxPrice,
      sort = '-createdAt', // e.g. 'price:asc' or 'price:desc'
      includeStats
    } = req.query;

    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Parse sort: allow comma-separated fields, support :asc/:desc
    let sortSpec = {};
    if (sort) {
      const parts = sort.split(',');
      parts.forEach(p => {
        const [field, dir] = p.split(':');
        if (field) {
          sortSpec[field] = (dir && dir.toLowerCase() === 'asc') ? 1 : (dir && dir.toLowerCase() === 'desc') ? -1 : (field.startsWith('-') ? -1 : 1);
          if (field.startsWith('-')) {
            // handle legacy '-createdAt' style
            const clean = field.substring(1);
            sortSpec = { [clean]: -1 };
          }
        }
      });
    }
    if (Object.keys(sortSpec).length === 0) {
      sortSpec = { createdAt: -1 };
    }

    const [ totalProducts, products ] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort(sortSpec)
        .skip((pageInt - 1) * limitInt)
        .limit(limitInt)
        .exec()
    ]);

    const response = {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitInt),
      currentPage: pageInt,
      pageSize: limitInt,
      filterApplied: filter,
      sort: sortSpec
    };

    if (includeStats === '1') {
      const statsAgg = await Product.aggregate([
        { $match: filter },
        { $group: { _id: null, avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' }, totalStock: { $sum: '$stock' } } }
      ]);
      response.stats = statsAgg[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0, totalStock: 0 };
    }

    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single product by id (public)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }
    const product = await Product.findById(id).exec();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

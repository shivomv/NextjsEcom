const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    // Build query based on filters
    const query = {};

    // Filter by category
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    // Filter by search term
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { hindiName: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    } else if (req.query.minPrice) {
      query.price = { $gte: Number(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      query.price = { $lte: Number(req.query.maxPrice) };
    }

    // Filter by festival
    if (req.query.festival) {
      query.festivalRelated = true;
      query.festivalName = req.query.festival;
    }

    // Filter by featured
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by new arrivals
    if (req.query.newArrival === 'true') {
      query.isNewArrival = true;
    }

    // Filter by best sellers
    if (req.query.bestSeller === 'true') {
      query.isBestSeller = true;
    }

    // Only show active products
    query.isActive = true;

    // Count total products matching the query
    const count = await Product.countDocuments(query);

    // Get products with pagination
    let products;
    
    // Determine sort order
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { ratings: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    products = await Product.find(query)
      .populate('category', 'name hindiName slug')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name hindiName slug')
      .populate('subcategories', 'name hindiName slug');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name hindiName slug')
      .populate('subcategories', 'name hindiName slug');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      hindiName,
      slug,
      description,
      spiritualSignificance,
      price,
      comparePrice,
      category,
      subcategories,
      images,
      stock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      festivalRelated,
      festivalName,
      materials,
      dimensions,
      weight,
      tags,
      seo,
    } = req.body;

    // Check if slug already exists
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Create product
    const product = new Product({
      name,
      hindiName,
      slug,
      description,
      spiritualSignificance,
      price,
      comparePrice: comparePrice || 0,
      category,
      subcategories: subcategories || [],
      images,
      stock,
      isActive: true,
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false,
      isBestSeller: isBestSeller || false,
      festivalRelated: festivalRelated || false,
      festivalName: festivalName || '',
      materials: materials || [],
      dimensions: dimensions || {},
      weight: weight || {},
      tags: tags || [],
      seo: seo || {},
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      hindiName,
      slug,
      description,
      spiritualSignificance,
      price,
      comparePrice,
      category,
      subcategories,
      images,
      stock,
      isActive,
      isFeatured,
      isNewArrival,
      isBestSeller,
      festivalRelated,
      festivalName,
      materials,
      dimensions,
      weight,
      tags,
      seo,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // If slug is being changed, check if new slug already exists
      if (slug && slug !== product.slug) {
        const slugExists = await Product.findOne({ slug, _id: { $ne: req.params.id } });
        if (slugExists) {
          return res.status(400).json({ message: 'Product with this slug already exists' });
        }
      }

      // Check if category exists
      if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ message: 'Invalid category' });
        }
      }

      // Update product fields
      product.name = name || product.name;
      product.hindiName = hindiName || product.hindiName;
      product.slug = slug || product.slug;
      product.description = description || product.description;
      product.spiritualSignificance = spiritualSignificance || product.spiritualSignificance;
      product.price = price !== undefined ? price : product.price;
      product.comparePrice = comparePrice !== undefined ? comparePrice : product.comparePrice;
      product.category = category || product.category;
      product.subcategories = subcategories || product.subcategories;
      product.images = images || product.images;
      product.stock = stock !== undefined ? stock : product.stock;
      product.isActive = isActive !== undefined ? isActive : product.isActive;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
      product.festivalRelated = festivalRelated !== undefined ? festivalRelated : product.festivalRelated;
      product.festivalName = festivalName || product.festivalName;
      product.materials = materials || product.materials;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.tags = tags || product.tags;
      product.seo = seo || product.seo;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    
    const products = await Product.find({ isActive: true })
      .sort({ ratings: -1 })
      .limit(limit)
      .populate('category', 'name hindiName slug');
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const limit = Number(req.query.limit) || 4;
    
    const relatedProducts = await Product.find({
      _id: { $ne: req.params.id },
      category: product.category,
      isActive: true,
    })
      .limit(limit)
      .populate('category', 'name hindiName slug');
    
    res.json(relatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

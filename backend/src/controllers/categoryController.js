const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('parentCategory', 'name hindiName slug')
      .sort({ name: 1 });
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name hindiName slug')
      .populate('subcategories');
    
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parentCategory', 'name hindiName slug')
      .populate('subcategories');
    
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      hindiName,
      slug,
      description,
      image,
      isActive,
      parentCategory,
      festivalRelated,
      festivalName,
    } = req.body;

    // Check if slug already exists
    const slugExists = await Category.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    // Create category
    const category = new Category({
      name,
      hindiName,
      slug,
      description: description || '',
      image: image || 'default-category.jpg',
      isActive: isActive !== undefined ? isActive : true,
      parentCategory: parentCategory || null,
      festivalRelated: festivalRelated || false,
      festivalName: festivalName || '',
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const {
      name,
      hindiName,
      slug,
      description,
      image,
      isActive,
      parentCategory,
      festivalRelated,
      festivalName,
    } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      // If slug is being changed, check if new slug already exists
      if (slug && slug !== category.slug) {
        const slugExists = await Category.findOne({ slug, _id: { $ne: req.params.id } });
        if (slugExists) {
          return res.status(400).json({ message: 'Category with this slug already exists' });
        }
      }

      // Update category fields
      category.name = name || category.name;
      category.hindiName = hindiName || category.hindiName;
      category.slug = slug || category.slug;
      category.description = description !== undefined ? description : category.description;
      category.image = image || category.image;
      category.isActive = isActive !== undefined ? isActive : category.isActive;
      category.parentCategory = parentCategory !== undefined ? parentCategory : category.parentCategory;
      category.festivalRelated = festivalRelated !== undefined ? festivalRelated : category.festivalRelated;
      category.festivalName = festivalName !== undefined ? festivalName : category.festivalName;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      // Check if category has subcategories
      const hasSubcategories = await Category.findOne({ parentCategory: req.params.id });
      if (hasSubcategories) {
        return res.status(400).json({ message: 'Cannot delete category with subcategories' });
      }

      // Check if category has products
      const hasProducts = await Product.findOne({ category: req.params.id });
      if (hasProducts) {
        return res.status(400).json({ message: 'Cannot delete category with products' });
      }

      await category.remove();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get parent categories
// @route   GET /api/categories/parents
// @access  Public
exports.getParentCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: null, isActive: true })
      .sort({ name: 1 });
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get subcategories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.find({ 
      parentCategory: req.params.id,
      isActive: true 
    }).sort({ name: 1 });
    
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get festival categories
// @route   GET /api/categories/festivals
// @access  Public
exports.getFestivalCategories = async (req, res) => {
  try {
    const categories = await Category.find({ 
      festivalRelated: true,
      isActive: true 
    }).sort({ name: 1 });
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

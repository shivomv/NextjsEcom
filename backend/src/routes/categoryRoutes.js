const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getParentCategories,
  getSubcategories,
  getFestivalCategories,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/parents', getParentCategories);
router.get('/festivals', getFestivalCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id/subcategories', getSubcategories);
router.get('/:id', getCategoryById);

// Protected admin routes
router.route('/')
  .post(protect, admin, createCategory);

router.route('/:id')
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;

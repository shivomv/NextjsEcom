const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

// Create a guest cart controller
const guestCartController = {
  getGuestCart: (req, res) => {
    // Return empty cart for guest users
    res.json({
      cartItems: [],
      totalPrice: 0,
      totalItems: 0,
    });
  },
};

// Get cart and add to cart
router.route('/')
  .get(protect, getCart) // Protected route for authenticated users
  .post(protect, addToCart)
  .delete(protect, clearCart);

// Update and remove cart items
router.route('/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

// Guest cart route
router.route('/guest')
  .get(guestCartController.getGuestCart);

module.exports = router;

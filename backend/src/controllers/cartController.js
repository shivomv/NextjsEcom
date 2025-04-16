const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (!cart) {
      // If no cart exists, create an empty one
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if quantity is valid
    if (qty <= 0 || qty > product.stock) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.cartItems[existingItemIndex].qty = qty;
    } else {
      // Add new item
      cart.cartItems.push({
        product: productId,
        name: product.name,
        hindiName: product.hindiName || product.name,
        image: product.images[0],
        price: product.price,
        qty,
      });
    }

    // Update cart totals
    cart.totalItems = cart.cartItems.reduce((total, item) => total + item.qty, 0);
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    // Save cart
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const productId = req.params.id;

    // Validate quantity
    if (qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item in cart
    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Update item quantity
    cart.cartItems[cartItemIndex].qty = qty;

    // Update cart totals
    cart.totalItems = cart.cartItems.reduce((total, item) => total + item.qty, 0);
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    // Save cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    // Update cart totals
    cart.totalItems = cart.cartItems.reduce((total, item) => total + item.qty, 0);
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    // Save cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear cart items
    cart.cartItems = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    // Save cart
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

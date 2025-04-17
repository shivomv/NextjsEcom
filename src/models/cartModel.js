import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    cartItems: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total price
cartSchema.virtual('totalPrice').get(function () {
  return this.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
});

// Virtual for total items
cartSchema.virtual('totalItems').get(function () {
  return this.cartItems.reduce((total, item) => total + item.qty, 0);
});

// Delete the model if it exists to prevent overwrite warning in development
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;

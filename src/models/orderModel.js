import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'PayPal', 'Stripe', 'RazorPay'],
      default: 'COD',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
      gateway: { type: String },
      gateway_order_id: { type: String },
      gateway_signature: { type: String },
      payment_method_details: { type: Object },
      currency: { type: String, default: 'INR' },
      amount: { type: Number },
      receipt_number: { type: String },
      receipt_url: { type: String }
    },
    itemsPrice: { 
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Received', 'Stock Restored'],
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        note: String
      }
    ],
    statusTimeline: {
      Pending: {
        timestamp: Date,
        completed: {
          type: Boolean,
          default: false
        }
      },
      Processing: {
        timestamp: Date,
        completed: {
          type: Boolean,
          default: false
        }
      },
      Shipped: {
        timestamp: Date,
        completed: {
          type: Boolean,
          default: false
        }
      },
      Delivered: {
        timestamp: Date,
        completed: {
          type: Boolean,
          default: false
        }
      },
      Cancelled: {
        timestamp: Date,
        completed: {
          type: Boolean,
          default: false
        }
      }
    },
    courier: {
      type: String,
      enum: ['indiapost', 'delhivery', 'bluedart', 'dtdc', 'fedex', 'dhl', 'ekart', 'other'],
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number and add initial status to history
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `PS${year}${month}${day}${random}`;

    // Add initial status to history
    const currentTime = this.createdAt || new Date();
    this.statusHistory = [{
      status: this.status,
      timestamp: currentTime,
      note: 'Order created'
    }];

    // Initialize statusTimeline
    this.statusTimeline = {
      Pending: {
        timestamp: currentTime,
        completed: true
      },
      Processing: {
        timestamp: null,
        completed: false
      },
      Shipped: {
        timestamp: null,
        completed: false
      },
      Delivered: {
        timestamp: null,
        completed: false
      },
      Cancelled: {
        timestamp: null,
        completed: false
      }
    };
  }
  next();
});

// Delete the model if it exists to prevent overwrite warning in development
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;

import mongoose from 'mongoose';

const paymentGatewaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a payment gateway name'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a payment gateway code'],
      trim: true,
      unique: true,
      enum: ['razorpay', 'paypal', 'stripe', 'cod', 'other'],
    },
    logo: {
      type: String,
    },
    logoData: {
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      resourceType: String
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    credentials: {
      apiKey: {
        type: String,
      },
      secretKey: {
        type: String,
      },
      merchantId: {
        type: String,
      },
      sandboxMode: {
        type: Boolean,
        default: true,
      },
    },
    settings: {
      supportedCurrencies: [String],
      minAmount: {
        type: Number,
        default: 0,
      },
      maxAmount: {
        type: Number,
        default: 100000,
      },
      processingFee: {
        type: Number,
        default: 0,
      },
      processingFeeType: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'percentage',
      },
    },
    instructions: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model if it exists to prevent overwrite warning in development
const PaymentGateway = mongoose.models.PaymentGateway || mongoose.model('PaymentGateway', paymentGatewaySchema);

export default PaymentGateway;

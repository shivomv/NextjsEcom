import mongoose from 'mongoose';
import slugify from 'slugify';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    images: [String],
    imagesData: [
      {
        url: String,
        publicId: String,
        width: Number,
        height: Number,
        format: String,
        resourceType: String
      }
    ],
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    helpful: {
      count: {
        type: Number,
        default: 0
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    reported: {
      count: {
        type: Number,
        default: 0
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: [true, 'Please add a product image'],
    },
    imageData: {
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      resourceType: String
    },
    images: [String],
    imagesData: [
      {
        url: String,
        publicId: String,
        width: Number,
        height: Number,
        format: String,
        resourceType: String
      }
    ],
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    mrp: {
      type: Number,
      required: [true, 'Please add an MRP'],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
    tags: [String],
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['g', 'kg', 'lb', 'oz'],
        default: 'g',
      },
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ isFeatured: 1 });

// Create slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Calculate discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.mrp > 0 && this.price < this.mrp) {
    return Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  return 0;
});

// Delete the model if it exists to prevent overwrite warning in development
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;

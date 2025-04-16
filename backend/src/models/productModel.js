const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    hindiName: {
      type: String,
      required: [true, 'Please provide a Hindi product name'],
      trim: true,
      maxlength: [100, 'Hindi name cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a product slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    spiritualSignificance: {
      type: String,
      maxlength: [2000, 'Spiritual significance cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      default: 0,
      min: [0, 'Price must be positive'],
    },
    comparePrice: {
      type: Number,
      default: 0,
      min: [0, 'Compare price must be positive'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    images: [
      {
        type: String,
        required: [true, 'Please provide at least one product image'],
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please provide product stock'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    festivalRelated: {
      type: Boolean,
      default: false,
    },
    festivalName: {
      type: String,
    },
    materials: [
      {
        type: String,
      },
    ],
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length must be positive'],
      },
      width: {
        type: Number,
        min: [0, 'Width must be positive'],
      },
      height: {
        type: Number,
        min: [0, 'Height must be positive'],
      },
      unit: {
        type: String,
        enum: ['cm', 'inch'],
        default: 'cm',
      },
    },
    weight: {
      value: {
        type: Number,
        min: [0, 'Weight must be positive'],
      },
      unit: {
        type: String,
        enum: ['g', 'kg'],
        default: 'g',
      },
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative'],
    },
    tags: [
      {
        type: String,
      },
    ],
    seo: {
      metaTitle: {
        type: String,
        maxlength: [100, 'Meta title cannot be more than 100 characters'],
      },
      metaDescription: {
        type: String,
        maxlength: [200, 'Meta description cannot be more than 200 characters'],
      },
      metaKeywords: {
        type: String,
        maxlength: [200, 'Meta keywords cannot be more than 200 characters'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

module.exports = mongoose.model('Product', productSchema);

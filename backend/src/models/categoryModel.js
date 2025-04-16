const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    hindiName: {
      type: String,
      required: [true, 'Please provide a Hindi category name'],
      trim: true,
      maxlength: [50, 'Hindi name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a category slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    image: {
      type: String,
      default: 'default-category.jpg',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    festivalRelated: {
      type: Boolean,
      default: false,
    },
    festivalName: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
  justOne: false,
});

module.exports = mongoose.model('Category', categorySchema);

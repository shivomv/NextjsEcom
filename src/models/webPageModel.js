import mongoose from 'mongoose';
import slugify from 'slugify';

const webPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a page title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please add page content'],
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    featuredImageData: {
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      resourceType: String
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showInFooter: {
      type: Boolean,
      default: false,
    },
    showInHeader: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    pageType: {
      type: String,
      enum: ['about', 'contact', 'terms', 'privacy', 'faq', 'shipping', 'returns', 'custom'],
      default: 'custom',
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
webPageSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

// Delete the model if it exists to prevent overwrite warning in development
const WebPage = mongoose.models.WebPage || mongoose.model('WebPage', webPageSchema);

export default WebPage;

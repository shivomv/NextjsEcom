import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a banner title'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add a banner image'],
    },
    imageData: {
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      resourceType: String
    },
    link: {
      type: String,
    },
    buttonText: {
      type: String,
    },
    position: {
      type: String,
      enum: ['home_hero', 'home_middle', 'home_bottom', 'category_page', 'product_page', 'sidebar'],
      default: 'home_hero',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF',
    },
    textColor: {
      type: String,
      default: '#000000',
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model if it exists to prevent overwrite warning in development
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

export default Banner;

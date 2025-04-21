import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Please add a setting key'],
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please add a setting value'],
    },
    group: {
      type: String,
      enum: ['general', 'payment', 'notification', 'social', 'cloudinary', 'other'],
      default: 'other',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model if it exists to prevent overwrite warning in development
const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;

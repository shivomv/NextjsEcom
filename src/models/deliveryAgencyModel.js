import mongoose from 'mongoose';

const deliveryAgencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a delivery agency name'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a delivery agency code'],
      trim: true,
      unique: true,
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
    trackingUrl: {
      type: String,
      required: [true, 'Please add a tracking URL'],
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    website: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    serviceAreas: [String],
    shippingRates: [
      {
        minWeight: Number,
        maxWeight: Number,
        price: Number,
      },
    ],
    estimatedDeliveryDays: {
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 7,
      },
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model if it exists to prevent overwrite warning in development
const DeliveryAgency = mongoose.models.DeliveryAgency || mongoose.model('DeliveryAgency', deliveryAgencySchema);

export default DeliveryAgency;

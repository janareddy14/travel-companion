const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    bestSeason: {
      type: String,
      default: '',
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    highlights: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual id field
destinationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Text index for search on name and country
destinationSchema.index({ name: 'text', country: 'text' });
destinationSchema.index({ country: 1 });

module.exports = mongoose.model('Destination', destinationSchema);

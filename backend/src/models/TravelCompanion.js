const mongoose = require('mongoose');

const travelCompanionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    destinationName: {
      type: String,
      required: [true, 'Destination name is required'],
    },
    travelDates: {
      type: String,
      default: '',
    },
    interests: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    contactInfo: {
      type: String,
      default: '',
    },
    budgetMin: {
      type: Number,
      default: 0,
    },
    budgetMax: {
      type: Number,
      default: 10000,
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
travelCompanionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Indexes
travelCompanionSchema.index({ destinationName: 1 });
travelCompanionSchema.index({ userId: 1, destinationName: 1 });

module.exports = mongoose.model('TravelCompanion', travelCompanionSchema);

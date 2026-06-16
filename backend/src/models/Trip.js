const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    budget: {
      type: Number,
      default: 0,
    },
    travelType: {
      type: String,
      enum: ['SOLO', 'COUPLE', 'FAMILY', 'ADVENTURE', 'GROUP', 'BUSINESS'],
      default: 'SOLO',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNED',
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
tripSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Indexes
tripSchema.index({ userId: 1, status: 1 });
tripSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Trip', tripSchema);

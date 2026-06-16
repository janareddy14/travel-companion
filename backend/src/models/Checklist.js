const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      index: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
    },
    completed: {
      type: Boolean,
      default: false,
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
checklistSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Compound index for querying incomplete items per trip
checklistSchema.index({ tripId: 1, completed: 1 });

module.exports = mongoose.model('Checklist', checklistSchema);

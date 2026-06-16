const mongoose = require('mongoose');

const companionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
      index: true,
    },
    senderCompanionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelCompanion',
    },
    receiverCompanionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelCompanion',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: '',
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
companionRequestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Unique compound index — one request per sender-receiver pair
companionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
companionRequestSchema.index({ status: 1 });

module.exports = mongoose.model('CompanionRequest', companionRequestSchema);

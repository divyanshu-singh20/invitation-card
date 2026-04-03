const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or string for static products
    required: true,
    index: true
  },
  productSlug: {
    type: String,
    required: true,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestName: {
    type: String,
    required: true
  },
  guestMobile: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  images: [{
    url: String,
    publicId: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per order
reviewSchema.index({ order: 1, user: 1 }, { unique: true, sparse: true });
reviewSchema.index({ order: 1, guestMobile: 1 }, { unique: true, sparse: true });

// Index for querying reviews by product
reviewSchema.index({ productSlug: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);

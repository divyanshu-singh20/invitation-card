const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hindu', 'muslim', 'christian', 'modern', 'traditional']
  },
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['front', 'inside', 'back']
    }
  }],
  basePrice: {
    type: Number,
    required: true
  },
  pricePerHundred: {
    type: Number,
    required: true
  },
  paperOptions: [{
    type: {
      type: String,
      required: true
    },
    priceMultiplier: {
      type: Number,
      default: 1
    }
  }],
  colors: [{
    name: String,
    code: String
  }],
  availableFonts: [{
    name: String,
    previewUrl: String
  }],
  deliveryDays: {
    type: Number,
    default: 7
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

designSchema.index({ category: 1, basePrice: 1 });
designSchema.index({ featured: 1 });

module.exports = mongoose.model('Design', designSchema);

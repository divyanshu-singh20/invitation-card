const mongoose = require('mongoose');

const sellerProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'wedding-printing',
      'birthday-anniversary', 
      'grih-pravesh-puja',
      'business-printing',
      'flex-banner-poster',
      'shop-office-opening',
      'religious-events',
      'school-college-printing',
      'stickers-labels',
      'condolence-shraddh',
      'calendars-diaries',
      'certificates-awards',
      'digital-invitations',
      'personalized-gifts',
      // Legacy categories (for existing data)
      'hindu', 'muslim', 'christian', 'sikh', 'modern', 'traditional', 'luxury', 'budget', 'eco-friendly'
    ]
  },
  subCategory: {
    type: String,
    default: ''
  },
  // Images - minimum 2, maximum 10
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String, // For cloudinary
    type: {
      type: String,
      enum: ['front', 'back', 'inside', 'detail', 'other'],
      default: 'other'
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  // Pricing
  basePrice: {
    type: Number,
    required: true
  },
  pricePerHundred: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 90
  },
  // Paper Options
  paperOptions: [{
    type: {
      type: String,
      required: true
    },
    gsm: Number,
    priceMultiplier: {
      type: Number,
      default: 1
    }
  }],
  // Colors available
  colors: [{
    name: String,
    code: String // hex code
  }],
  // Available fonts
  availableFonts: [{
    name: String,
    family: String
  }],
  // Specifications
  specifications: {
    size: {
      type: String,
      default: '8x4 inches'
    },
    weight: String,
    material: String,
    printType: {
      type: String,
      enum: ['offset', 'digital', 'screen', 'foil', 'embossed', 'letterpress'],
      default: 'offset'
    }
  },
  // Minimum order quantity
  minOrderQuantity: {
    type: Number,
    default: 50
  },
  // Delivery
  deliveryDays: {
    type: Number,
    default: 7
  },
  // Stock
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 1000
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: Date,
  // Features
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Tags for search
  tags: [String],
  // Stats
  views: {
    type: Number,
    default: 0
  },
  orders: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Generate slug before saving
sellerProductSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }
  next();
});

// Validate images count
sellerProductSchema.pre('save', function(next) {
  if (this.images.length < 2) {
    const error = new Error('Minimum 2 images are required');
    error.name = 'ValidationError';
    return next(error);
  }
  if (this.images.length > 10) {
    const error = new Error('Maximum 10 images are allowed');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

// Indexes
sellerProductSchema.index({ seller: 1, status: 1 });
sellerProductSchema.index({ category: 1, status: 1 });
sellerProductSchema.index({ basePrice: 1 });
sellerProductSchema.index({ featured: 1, status: 1 });
sellerProductSchema.index({ tags: 1 });

module.exports = mongoose.model('SellerProduct', sellerProductSchema);

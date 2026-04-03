const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestMobile: {
    type: String
  },
  guestName: {
    type: String
  },
  guestEmail: {
    type: String
  },
  // Support both old format (design) and new format (product)
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design'
  },
  // Product can be ObjectId (from DB) or String (from static data)
  product: {
    type: mongoose.Schema.Types.Mixed
  },
  // Store product info for static data products
  productInfo: {
    id: String,
    name: String,
    slug: String,
    price: Number,
    image: String
  },
  customization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customization'
  },
  // Card details for self-customization orders
  cardDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  // Quick contact for contact-based orders
  quickContact: {
    fullName: String,
    mobileNumber: String,
    message: String
  },
  orderType: {
    type: String,
    enum: ['manual', 'contact', 'customization'],
    default: 'manual'
  },
  orderNote: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  paperType: {
    type: String,
    default: 'Standard'
  },
  pricePerCard: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'online', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['ordered', 'confirmed', 'printing', 'shipped', 'delivered', 'cancelled'],
    default: 'ordered'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  }
}, {
  timestamps: true
});

// orderSchema.index({ orderId: 1 });
orderSchema.index({ guestMobile: 1 });
orderSchema.index({ user: 1 });

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderId = `SC${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

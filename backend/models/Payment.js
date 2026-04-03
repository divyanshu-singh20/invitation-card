const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'failed'],
    default: 'created'
  },
  method: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'cod']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);

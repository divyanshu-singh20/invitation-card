const express = require('express');
const router = express.Router();
const Payment = require('../../models/Payment');
const Order = require('../../models/Order');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      paymentMethod, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const payments = await Payment.find(query)
      .populate({
        path: 'order',
        populate: [
          { path: 'user', select: 'name mobile' },
          { path: 'design', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPayments: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments' 
    });
  }
});

// @route   PUT /api/admin/payments/:id/mark-paid
// @desc    Mark COD payment as paid
// @access  Admin
router.put('/:id/mark-paid', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    if (payment.paymentMethod !== 'cod') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only COD payments can be marked as paid manually' 
      });
    }

    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    res.json({
      success: true,
      message: 'Payment marked as paid',
      payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error marking payment as paid' 
    });
  }
});

// @route   PUT /api/admin/payments/:id/refund
// @desc    Process refund
// @access  Admin
router.put('/:id/refund', async (req, res) => {
  try {
    const { refundReason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only paid payments can be refunded' 
      });
    }

    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundReason = refundReason;
    await payment.save();

    // Update order status to cancelled
    if (payment.order) {
      await Order.findByIdAndUpdate(payment.order, { status: 'cancelled' });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error processing refund' 
    });
  }
});

module.exports = router;
